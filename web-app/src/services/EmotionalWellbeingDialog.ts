import { DialogOption, DialogType } from "../types/dialogTypes";
import client from "../graphql/client";
import {
  fetchQuestionnaire,
  restartQuestionnaire,
  startQuestionnaire,
  submitAnswer,
  updateUserInfo,
} from "../graphql/requests";
import FlowManagerDialog, { DialogItem, InputType } from "./FlowManagerDialog";
import { standardDialogs } from "../dialogs/standardDialogs";

export interface SpecificDialogItem {
  id: number;
  name: string;
  label?: string;
  options?: DialogOption[];
  fromApi?: boolean;
}

export default class EmotionalWellbeingDialog extends FlowManagerDialog {
  private userId: number;
  private questionnaireId: number | null = null;

  constructor(firstName: string, userId: number) {
    const dialogs = standardDialogs(firstName);
    super(dialogs);
    this.userId = userId;
  }

  public getCurrentDialog(): DialogType {
    return this.dialogs[this.currentStep];
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

    if (currentDialog.name === "start" && input === "no") {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "noWorries",
      );

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "noWorries" && input === "restart") {
      await restartQuestionnaire(
        client,
        this.userId,
        Number(this.questionnaireId),
      );
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "restart",
      );

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "noWorries" && input === "continue") {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "start",
      );

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "start" && input === "yes") {
      const result = await fetchQuestionnaire(
        client,
        "EmotionalWellbeingDialog",
      );

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

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "restart") {
      const userId = await startQuestionnaire(
        client,
        String(input),
        "EmotionalWellbeingDialog",
      );

      this.userId = Number(userId);
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "greetings",
      );

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "selfHarmThoughts" && Number(input) > 0) {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "safetyMessage",
      );

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "safetyMessage" && input === "999") {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "calling999",
      );

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "safetyMessage" && input === "samaritans") {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "callingSamaritans",
      );

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "safetyMessage" && input === "continue") {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "difficultyLevel",
      );

      return this.getCurrentDialog();
    }

    if (currentDialog.name === "difficultyLevel") {
      this.currentStep = this.dialogs.findIndex(
        (dialog) => dialog?.name === "thanks",
      );
      return this.getCurrentDialog();
    }

    if (
      ["phoneNumber", "birthday", "contactMethod"].includes(currentDialog.name)
    ) {
      const consentToPush = Array(input).includes("push");
      const consentToEmail = Array(input).includes("email");
      const consentToCall = Array(input).includes("phone");

      await updateUserInfo(client, this.userId, {
        phoneNumber:
          currentDialog.name === "phoneNumber" ? String(input) : undefined,
        dateOfBirth:
          currentDialog.name === "birthday" ? String(input) : undefined,
        email: undefined,
        consentToPush: consentToPush ? true : undefined,
        consentToEmail: consentToEmail ? true : undefined,
        consentToCall: consentToCall ? true : undefined,
      });
    }

    if (
      ["goodbye", "callingSamaritans", "calling999"].includes(
        currentDialog.name,
      )
    ) {
      return;
    }

    this.moveToNext();
    return this.getCurrentDialog();
  }

  private resolveSpecificQuestions(result: any): SpecificDialogItem[] {
    return result.questions.map(
      (question: SpecificDialogItem, index: number) => ({
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
