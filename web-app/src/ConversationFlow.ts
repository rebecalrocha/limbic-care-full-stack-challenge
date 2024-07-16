import { dialogs } from "./dialogs";

interface DialogItem {
  name: string;
  introMessage?: string;
  question?: string;
  feedbackMessage?: string;
  type?: string;
  options?: { label: string; value: any }[];
}

export default class ConversationFlow {
  private dialogs: DialogItem[];
  private currentStep: number;

  constructor(firstName: string) {
    this.dialogs = dialogs(firstName);
    this.currentStep = 0;
  }

  public getCurrentDialog(): DialogItem {
    return this.dialogs[this.currentStep];
  }

  public moveToNext(): void {
    this.currentStep++;
  }

  public processUserInput(
    input: string | number | Date | string[],
  ): DialogItem | undefined {
    const currentDialog = this.dialogs[this.currentStep];

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
