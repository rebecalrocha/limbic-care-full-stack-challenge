import { DialogType } from "../types/dialogTypes";

export const emotionalWellbeingDialogs = (firstName: string): DialogType[] => [
  {
    name: "greetings",
    feedbackMessage: `Nice to meet you, ${firstName}!`,
  },
  {
    name: "start",
    introMessage:
      "For us to get started I will need to ask you some questions on how you've been feeling lately.",
    question: "Shall we start?",
    type: "single_choice",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    name: "noWorries",
    question: "No worries, feel free to come back to this anytime.",
    options: [
      { label: "I want to restart", value: "restart" },
      { label: "Let's continue", value: "continue" },
    ],
    type: "single_choice",
  },
  {
    name: "continuation",
    feedbackMessage: "Alright, so...",
  },
  {
    name: "safetyMessage",
    question:
      "If you feel like you can't keep yourself or others safe right now, call the Samaritans at 999 in case of emergency.",
    options: [
      { label: "Call 999", value: "999" },
      { label: "Call Samaritans", value: "samaritans" },
      { label: "Continue", value: "continue" },
    ],
    type: "single_choice",
  },
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
    name: "bye",
    feedbackMessage: `Thanks, ${firstName}, that's all for now!`,
  },
];
