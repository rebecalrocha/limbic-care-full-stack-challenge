import { format } from "date-fns";
import { DialogType } from "../../types/dialogTypes";

export type InputType = string | number | Date | string[];

export class InputParser {
  public static parseInputValue(input: InputType): InputType {
    return typeof input === "string" && !isNaN(parseInt(input, 10))
      ? parseInt(input, 10)
      : input;
  }
}

export class LabelFormatter {
  public static getOptionLabel(
    currentDialog: DialogType,
    input: string | Date,
  ): string {
    if (currentDialog?.type === "single_choice" && currentDialog?.options) {
      const inputValue = InputParser.parseInputValue(input);
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
}

export class DateValidator {
  public static formatDate(input: InputType): string {
    const date = typeof input === "string" ? new Date(input) : (input as Date);
    return format(date, "dd MMMM yyyy");
  }
}
