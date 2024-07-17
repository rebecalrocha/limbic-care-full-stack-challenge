import { DialogType } from "../types/dialogTypes";

export const introductionDialogs = (firstName: string): DialogType[] => [
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
    name: "restart",
    introMessage: "Alright, so...",
    question: "What's your name?",
    type: "text",
  },
];
