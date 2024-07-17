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

  public getNextDialog(): DialogType {
    this.currentStep++;
    return this.dialogs[this.currentStep];
  }

  public moveToNext(): void {
    this.currentStep++;
  }
}
