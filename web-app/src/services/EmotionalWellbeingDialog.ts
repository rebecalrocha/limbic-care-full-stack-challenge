import { emotionalWellbeingDialogs } from "../dialogs/EmotionalWellbeingDialog";
import FlowManagerDialog, { DialogItem, InputType } from "./FlowManagerDialog";

export default class EmotionalWellbeingDialog extends FlowManagerDialog {
  private userId: string | null;

  constructor(firstName: string, userId: string | null) {
    const dialogs = emotionalWellbeingDialogs(firstName);
    super(dialogs);
    this.userId = userId;
  }

  public processUserInput(input: InputType): DialogItem | undefined {
    const currentDialog = this.getCurrentDialog();

    if (currentDialog.name === "greetings") {
      if (input === "yes") {
        this.moveToNext();
      } else if (input === "no") {
        this.currentStep++;
      }
    } else if (currentDialog.name === "noWorries") {
      if (input === "restart") {
        this.currentStep = this.dialogs.findIndex(
          (dialog) => dialog.name === "continuation",
        );
        this.currentStep = this.dialogs.findIndex(
          (dialog) => dialog.name === "greetings",
        );
      } else if (input === "continue") {
        this.currentStep = this.dialogs.findIndex(
          (dialog) => dialog.name === "continuation",
        );
        this.moveToNext();
      }
    } else {
      this.moveToNext();
    }

    return this.getCurrentDialog();
  }
}
