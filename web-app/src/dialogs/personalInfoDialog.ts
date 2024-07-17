import { DialogType } from "../types/dialogTypes";

export const personalInfoDialog = (firstName: string): DialogType[] => [
  {
    name: "thanks",
    feedbackMessage: `Thanks for answering these questions, ${firstName}!`,
  },
  {
    name: "phoneNumber",
    introMessage: "Now I will need to ask you for some personal information.",
    question: "What is your phone number?",
    type: "number",
  },
  {
    name: "birthday",
    question: "And your birthday?",
    type: "date",
  },
  {
    name: "contactMethod",
    question: "How can we contact you?",
    type: "multi_choice",
    options: [
      { label: "Phone", value: "phone" },
      { label: "Email", value: "email" },
      { label: "Push", value: "push" },
    ],
  },
  {
    name: "goodbye",
    feedbackMessage: `Thanks, ${firstName}, that's all for now!`,
  },
];
