import { DialogType } from "../types/dialogTypes";

export const crisisDialog: DialogType[] = [
  {
    name: "safetyMessage",
    question:
      "If you feel like you can't keep yourself or others safe right now, call the Samaritans at 999 in case of emergency.",
    options: [
      { label: "Call 999", value: "emergency" },
      { label: "Call Samaritans", value: "samaritans" },
      { label: "Continue", value: "continue" },
    ],
    type: "single_choice",
  },
  {
    name: "callingEmergency",
    feedbackMessage: "Start call to 999.",
  },
  {
    name: "callingSamaritans",
    feedbackMessage: "Start call to Samaritans.",
  },
];
