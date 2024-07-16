import { dialogs } from "./dialogs";

interface DialogItem {
  name: string;
  greetings?: string;
  introMessage?: string;
  question: string;
  nextMessage?: string;
  type: string;
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

  public processUserInput(
    input: string | boolean | number | Date,
  ): DialogItem | undefined {
    const currentDialog = this.dialogs[this.currentStep];

    if (currentDialog.type === "input") {
      this.moveToNext();
    } else if (currentDialog.type === "multi_choice" && currentDialog.options) {
      const option = currentDialog.options.find((opt) => opt.value === input);
      if (option) {
        if (currentDialog.nextMessage && option.value !== "continue") {
          currentDialog.question = currentDialog.nextMessage;
        }
        this.moveToNext();
      }
    }

    return this.getCurrentDialog();
  }

  private moveToNext(): void {
    this.currentStep++;
  }
}
