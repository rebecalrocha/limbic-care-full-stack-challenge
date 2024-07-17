import React, { useEffect } from "react";
import { Box } from "@mui/material";
import EmotionalWellbeingDialog from "../services/EmotionalWellbeingDialog";
import InputField from "../components/InputField";
import SingleChoiceSelect from "../components/SingleChoiceSelect";
import MultiChoiceSelect from "../components/MultiChoiceSelect";
import { Message } from "../App";
import { startQuestionnaire } from "../graphql/requests";
import client from "../graphql/client";

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
    const userId = await startQuestionnaire(
      client,
      userInput,
      "EmotionalWellbeingDialog",
    );
    const newSurvey = new EmotionalWellbeingDialog(userInput, userId);
    setConversationFlow(newSurvey);
    addMessage(userInput, "user");

    const nextDialog = await newSurvey.processUserInput(input);
    if (nextDialog?.question) {
      console.log("aqui:  ", nextDialog.question);
      addMessage(nextDialog.question, "bot");
    }
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
    if (nextDialog?.question) {
      addMessage(nextDialog.question, "bot");
    }
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

  useEffect(() => {
    const currentDialog = conversationFlow?.getCurrentDialog();
    if (!currentDialog) return;

    const newMessages: Message[] = [];

    if (currentDialog.introMessage) {
      newMessages.push({ text: currentDialog.introMessage, sender: "bot" });
    }

    if (currentDialog.feedbackMessage) {
      newMessages.push({ text: currentDialog.feedbackMessage, sender: "bot" });
      if (
        !currentDialog.question &&
        !["goodbye", "callingSamaritans", "calling999"].includes(
          currentDialog.name,
        )
      )
        conversationFlow?.moveToNext();
    }

    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  }, [conversationFlow, conversationFlow?.getCurrentDialog()]);

  return <Box>{renderCurrentDialogOptions()}</Box>;
};

export default DialogManager;
