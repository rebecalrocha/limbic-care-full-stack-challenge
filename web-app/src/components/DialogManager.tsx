import React from "react";
import { Box } from "@mui/material";
import EmotionalWellbeingDialog from "../services/EmotionalWellbeingDialog";
import InputField from "../components/InputField";
import SingleChoiceSelect from "../components/SingleChoiceSelect";
import MultiChoiceSelect from "../components/MultiChoiceSelect";
import { Message } from "../App";

interface Props {
  conversationFlow?: EmotionalWellbeingDialog;
  setConversationFlow: React.Dispatch<
    React.SetStateAction<EmotionalWellbeingDialog | undefined>
  >;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const DialogManager: React.FC<Props> = ({
  conversationFlow,
  setConversationFlow,
  setMessages,
}) => {
  const addMessage = (text: string, sender: "bot" | "user") => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const handleNameInput = async (input: string | Date) => {
    const userInput = input.toString();
    const newSurvey = new EmotionalWellbeingDialog(userInput);
    setConversationFlow(newSurvey);
    addMessage(userInput, "user");

    const nextDialog = await newSurvey.processUserInput(input);

    const newMessages: Message[] = [];

    if (nextDialog?.introMessage) {
      newMessages.push({ text: nextDialog.introMessage, sender: "bot" });
    }

    if (nextDialog?.question) {
      newMessages.push({ text: nextDialog.question, sender: "bot" });
    }

    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  const handleDialogInput = async (input: string | Date | string[]) => {
    if (!conversationFlow) return;

    const inputLabel = Array.isArray(input)
      ? input
          .map((partialInput) => conversationFlow.getOptionLabel(partialInput))
          .join(", ")
      : conversationFlow.getOptionLabel(input);

    addMessage(inputLabel, "user");

    const nextDialog = await conversationFlow.processUserInput(input);

    const newMessages: Message[] = [];

    if (nextDialog?.introMessage) {
      newMessages.push({ text: nextDialog.introMessage, sender: "bot" });
    }

    if (nextDialog?.feedbackMessage) {
      newMessages.push({ text: nextDialog.feedbackMessage, sender: "bot" });

      if (
        !nextDialog.question &&
        !["goodbye", "callingSamaritans", "calling999"].includes(
          nextDialog.name,
        )
      ) {
        conversationFlow.moveToNext();
      }
    }

    if (nextDialog?.question) {
      newMessages.push({ text: nextDialog.question, sender: "bot" });
    }

    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  const renderCurrentDialogOptions = () => {
    if (!conversationFlow) {
      return <InputField onInput={handleNameInput} />;
    }

    const currentDialog = conversationFlow.getCurrentDialog();

    switch (currentDialog?.type) {
      case "text":
      case "number":
      case "date":
        return (
          <InputField onInput={handleDialogInput} type={currentDialog.type} />
        );
      case "multi_choice":
        return (
          <MultiChoiceSelect
            options={currentDialog?.options}
            onInput={handleDialogInput}
          />
        );
      default:
      case "single_choice":
        return (
          <SingleChoiceSelect
            options={currentDialog?.options}
            onInput={handleDialogInput}
          />
        );
    }
  };

  return <Box>{renderCurrentDialogOptions()}</Box>;
};

export default DialogManager;
