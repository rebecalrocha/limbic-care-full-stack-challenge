// dialogs.ts
export const dialogs = (firstName: string) => [
  {
    name: "greetings",
    greetings: `Nice to meet you, ${firstName}!`,
    introMessage:
      "For us to get started I will need to ask you some questions on how you've been feeling lately.",
    question: "Shall we start?",
    type: "multi_choice",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    name: "noWorries",
    question: "No worries, feel free to come back to this anytime.",
    options: [
      { label: "I want to restart", value: "restart" },
      { label: "Let's continue", value: "continue" },
    ],
    type: "multi_choice",
    nextMessage: "Alright, so...",
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
    type: "multi_choice",
  },
  {
    name: "thanks",
    greetings: `Thanks for answering these questions, ${firstName}!`,
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
    nextMessage: `Thanks, ${firstName}, that's all for now!`,
  },
];
