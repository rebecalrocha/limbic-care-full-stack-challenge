import {
  startQuestionnaire,
  restartQuestionnaire,
  fetchQuestionnaire,
  submitAnswer,
  updateUserInfo,
} from "../graphql/requests";
import client from "../graphql/client";
import { introductionDialogs } from "../dialogs/introductionDialog";
import { personalInfoDialog } from "../dialogs/personalInfoDialog";
import { DialogOption } from "../types/dialogTypes";
import FlowManagerDialog, { DialogItem, InputType } from "./FlowManagerDialog";
import { crisisDialog } from "../dialogs/crisisDialog";

const QuestionnaireName = "EmotionalWellbeingDialog";

export interface EmotionalWellbeingDialogItem {
  id: number;
  name: string;
  label?: string;
  options?: DialogOption[];
  fromApi?: boolean;
}
export default class EmotionalWellbeingDialog extends FlowManagerDialog {
  private userId?: number;
  private questionnaireId?: number;
  private firstName: string;

  constructor(firstName: string) {
    const dialogs = introductionDialogs(firstName);
    super(dialogs);
    this.firstName = firstName;
  }

  public async processUserInput(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    const currentDialog = this.getCurrentDialog();

    if (currentDialog.fromApi) {
      await submitAnswer(
        client,
        this.userId!,
        currentDialog.id!,
        Number(input),
      );
    }

    switch (currentDialog.name) {
      case "greetings":
        return this.handleStartDialog(input);
      case "start":
        return this.handleGetQuestions(input);
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
      case "calling":
        return;
      case "greetings":
      case "continuation":
      case "thanks":
        return this.getCurrentDialog();
      default:
        this.moveToNext();
        return this.getCurrentDialog();
    }
  }

  private async handleStartDialog(input: InputType): Promise<DialogItem> {
    const name = String(input);
    const result = await startQuestionnaire(client, name, QuestionnaireName);
    console.log("result:  ", result);
    this.userId = result.userId;
    return this.getCurrentDialog();
  }

  private async handleGetQuestions(
    input: InputType,
  ): Promise<DialogItem | undefined> {
    const result = await fetchQuestionnaire(client, QuestionnaireName);
    this.questionnaireId = result.id;

    if (input === "yes") {
      this.questionnaireId = result.id;
      const specificQuestions = this.sanitizeSpecificQuestions(result);

      this.dialogs = [
        ...this.dialogs,
        ...specificQuestions,
        ...crisisDialog,
        ...personalInfoDialog(this.firstName),
      ];

      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "interestOrPleasure",
      );
    } else {
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
      await restartQuestionnaire(client, this.userId!, this.questionnaireId!);
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
    const firstName = String(input);
    const result = await startQuestionnaire(
      client,
      firstName,
      QuestionnaireName,
    );

    this.userId = result.userId;
    this.firstName = firstName;
    this.dialogs = introductionDialogs(firstName);

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
      case "emergency":
        this.currentStep = this.dialogs.findIndex(
          (dialog) => dialog?.name === "callingEmergency",
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

  private sanitizeSpecificQuestions(
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
