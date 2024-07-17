import { format } from "date-fns";
import { DialogOption, DialogType } from "../types/dialogTypes";

export interface DialogItem {
  name: string;
  introMessage?: string;
  question?: string;
  type?: string;
  options?: DialogOption[];
  feedbackMessage?: string;
}

export type InputType = string | number | Date | string[];

export default class FlowManagerDialog {
  protected dialogs: DialogType[];
  protected currentStep: number;

  constructor(dialogs: DialogType[]) {
    this.dialogs = dialogs;
    this.currentStep = 0;
  }

  public getCurrentDialog(): DialogType {
    return this.dialogs[this.currentStep];
  }

  public moveToNext(): void {
    this.currentStep++;
  }

  public getOptionLabel(input: string | Date): string {
    const currentDialog = this.getCurrentDialog();

    if (currentDialog?.type === "single_choice" && currentDialog?.options) {
      const inputValue = this.parseInputValue(input);
      const option = currentDialog?.options.find(
        (opt) => opt.value === inputValue,
      );
      if (option) return option.label;
    }

    if (currentDialog?.type === "multi_choice" && currentDialog?.options) {
      const option = currentDialog?.options.find((opt) => opt.value === input);
      if (option) return option.label;
    }

    if (currentDialog?.type === "date") {
      const date = typeof input === "string" ? new Date(input) : input;
      return format(date, "dd MMMM yyyy");
    }

    return input.toString();
  }

  public parseInputValue(input: InputType): InputType {
    return typeof input === "string" && !isNaN(parseInt(input, 10))
      ? parseInt(input, 10)
      : input;
  }
}
