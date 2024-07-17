import {
  startQuestionnaire,
  restartQuestionnaire,
  fetchQuestionnaire,
  submitAnswer,
  updateUserInfo,
} from "../graphql/requests";
import client from "../graphql/client";
import FlowManagerDialog, { DialogItem, InputType } from "./FlowManagerDialog";
import { standardDialogs } from "../dialogs/standardDialogs";
import { DialogOption } from "../types/dialogTypes";

export interface EmotionalWellbeingDialogItem {
  id: number;
  name: string;
  label?: string;
  options?: DialogOption[];
  fromApi?: boolean;
}
export default class EmotionalWellbeingDialog extends FlowManagerDialog {
  private userId: number | null = null;
  private questionnaireId: number | null = null;

  constructor(firstName: string) {
    const dialogs = standardDialogs(firstName);
    super(dialogs);
  }

  public async startQuestionnaire(firstName: string): Promise<void> {
    const userInput = firstName;
    const userId = await startQuestionnaire(
      client,
      userInput,
      "EmotionalWellbeingDialog",
    );
    this.userId = userId;

    const result = await fetchQuestionnaire(client, "EmotionalWellbeingDialog");

    if (result) {
      this.questionnaireId = result.id;

      const questions = this.resolveSpecificQuestions(result);

      const newDialogs = [
        ...this.dialogs.slice(0, 6),
        ...questions,
        ...this.dialogs.slice(6),
      ];

      this.dialogs = newDialogs;

      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "interestOrPleasure",
      );
    }
  }

  public async restartQuestionnaire(): Promise<void> {
    console.log("restartQuestionnaire: ", this.userId, this.questionnaireId);
    const userId = await restartQuestionnaire(
      client,
      this.userId!,
      this.questionnaireId!,
    );
    this.userId = userId;

    this.currentStep = this.dialogs.findIndex(
      (dialog) => dialog?.name === "greetings",
    );
  }

  public async processUserInput(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    const currentDialog = this.getCurrentDialog();

    if (currentDialog.fromApi) {
      await submitAnswer(
        client,
        this.questionnaireId!,
        Number(currentDialog.id),
        Number(input),
      );
    }

    switch (currentDialog.name) {
      case "start":
        return this.handleStartDialog(input);
      case "noWorries":
        return this.handleNoWorriesDialog(input);
      case "restart":
        return this.handleRestartDialog(input);
      case "selfHarmThoughts":
        return this.handleSelfHarmThoughtsDialog(input);
      case "safetyMessage":
        return this.handleSafetyMessageDialog(input);
      case "difficultyLevel":
        return this.handleDifficultyLevelDialog();
      case "phoneNumber":
      case "birthday":
      case "contactMethod":
        return this.handleContactInfoDialog(input);
      case "goodbye":
      case "callingSamaritans":
      case "calling999":
        return;
      default:
        this.moveToNext();
        return this.getCurrentDialog();
    }
  }

  private async handleStartDialog(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    await this.startQuestionnaire(String(input));
    if (input === "no") {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "noWorries",
      );
    }
    return this.getCurrentDialog();
  }

  private async handleNoWorriesDialog(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    if (input === "restart") {
      await this.restartQuestionnaire();
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "restart",
      );
    } else if (input === "continue") {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "start",
      );
    }
    return this.getCurrentDialog();
  }

  private async handleRestartDialog(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    const userId = await startQuestionnaire(
      client,
      String(input),
      "EmotionalWellbeingDialog",
    );

    this.userId = Number(userId);
    this.dialogs = standardDialogs(String(input));

    this.currentStep = this.dialogs.findIndex(
      (dialog) => dialog?.name === "greetings",
    );
    return this.getCurrentDialog();
  }

  private async handleSelfHarmThoughtsDialog(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    if (Number(input) === 0) {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "thanks",
      );
      // this.moveToNext();
      return this.getCurrentDialog();
    } else if (Number(input) > 0) {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "safetyMessage",
      );
      return this.getCurrentDialog();
    }
  }

  private async handleSafetyMessageDialog(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    switch (input) {
      case "999":
        this.currentStep = this.dialogs.findIndex(
          (dialog) => dialog?.name === "calling999",
        );
        break;
      case "samaritans":
        this.currentStep = this.dialogs.findIndex(
          (dialog) => dialog?.name === "callingSamaritans",
        );
        break;
      case "continue":
        this.currentStep = this.dialogs.findIndex(
          (dialog) => dialog?.name === "difficultyLevel",
        );
        break;
    }
    return this.getCurrentDialog();
  }

  private handleDifficultyLevelDialog(): DialogItem | undefined {
    this.currentStep = this.dialogs.findIndex(
      (dialog) => dialog?.name === "thanks",
    );
    return this.getCurrentDialog();
  }

  private async handleContactInfoDialog(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    const currentDialog = this.getCurrentDialog();

    const consentToPush = Array(input).includes("push");
    const consentToEmail = Array(input).includes("email");
    const consentToCall = Array(input).includes("phone");

    await updateUserInfo(client, this.userId!, {
      phoneNumber:
        currentDialog.name === "phoneNumber" ? String(input) : undefined,
      dateOfBirth:
        currentDialog.name === "birthday" ? String(input) : undefined,
      email: undefined,
      consentToPush: consentToPush ? true : undefined,
      consentToEmail: consentToEmail ? true : undefined,
      consentToCall: consentToCall ? true : undefined,
    });

    this.moveToNext();
    return this.getCurrentDialog();
  }

  private resolveSpecificQuestions(
    result: any,
  ): EmotionalWellbeingDialogItem[] {
    return result.questions.map(
      (question: EmotionalWellbeingDialogItem, index: number) => ({
        id: question.id,
        introMessage: index === 0 && result.introMessage,
        name: question.name,
        question: question.label,
        type: "single_choice",
        options: question.options,
        fromApi: true,
      }),
    );
  }
}
