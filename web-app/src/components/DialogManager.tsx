import React from "react";
import { Box } from "@mui/material";
import EmotionalWellbeingDialog from "../services/EmotionalWellbeingDialog";
import InputField from "../components/InputField";
import SingleChoiceSelect from "../components/SingleChoiceSelect";
import MultiChoiceSelect from "../components/MultiChoiceSelect";
import { Message } from "../App";
import { format } from "date-fns";
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
      "EmotionalWellbeingSurvey",
    );
    const newSurvey = new EmotionalWellbeingDialog(userInput, userId);
    setConversationFlow(newSurvey);
    addMessage(userInput, "user");
  };

  const handleDialogInput = (input: string | Date | string[]) => {
    if (!conversationFlow) return;

    const inputLabel = Array.isArray(input)
      ? input.map((partialInput) => getOptionLabel(partialInput)).join(", ")
      : getOptionLabel(input);

    addMessage(inputLabel, "user");

    const nextDialog = conversationFlow.processUserInput(input);
    if (nextDialog?.question) {
      addMessage(nextDialog.question, "bot");
    }
  };

  const getOptionLabel = (input: string | Date): string => {
    const currentDialog = conversationFlow!.getCurrentDialog();

    if (currentDialog?.type === "single_choice" && currentDialog.options) {
      const option = currentDialog.options.find((opt) => opt.value === input);
      if (option) return option.label;
    }

    if (currentDialog?.type === "multi_choice" && currentDialog.options) {
      const option = currentDialog.options.find((opt) => opt.value === input);
      if (option) return option.label;
    }

    if (currentDialog?.type === "date") {
      const date = typeof input === "string" ? new Date(input) : input;
      return format(date, "dd MMMM yyyy");
    }

    return input.toString();
  };

  const renderCurrentDialog = () => {
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
      case "single_choice":
        return (
          <SingleChoiceSelect
            options={currentDialog.options}
            onInput={handleDialogInput}
          />
        );
      case "multi_choice":
        return (
          <MultiChoiceSelect
            options={currentDialog.options}
            onInput={handleDialogInput}
          />
        );
      default:
        return null;
    }
  };

  return <Box>{renderCurrentDialog()}</Box>;
};

export default DialogManager;
