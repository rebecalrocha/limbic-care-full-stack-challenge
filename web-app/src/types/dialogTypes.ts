export type DialogTypeType =
  | "text"
  | "number"
  | "date"
  | "single_choice"
  | "multi_choice";

export interface DialogOption {
  label: string;
  value: string | number;
}

export interface DialogType {
  id?: number;
  name: string;
  feedbackMessage?: string;
  introMessage?: string;
  question?: string;
  type?: DialogTypeType;
  options?: DialogOption[];
  fromApi?: any;
}
