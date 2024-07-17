import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Message } from "../App";
import { DateValidator, LabelFormatter } from "../services/utils/dialogUtils";
import EmotionalWellbeingDialog from "../services/EmotionalWellbeingDialog";
import { helloDialog } from "../dialogs/helloDialog";
import InputField from "../components/InputField";
import SingleChoiceSelect from "../components/SingleChoiceSelect";
import MultiChoiceSelect from "../components/MultiChoiceSelect";

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
  const addMessages = (messages: Message[]) => {
    setMessages((prevMessages) => [...prevMessages, ...messages]);
  };

  const handleIntroInput = async (input: string | Date) => {
    const userInput = String(input);
    const newSurvey = new EmotionalWellbeingDialog(userInput);
    setConversationFlow(newSurvey);

    const newMessages: Message[] = [{ text: userInput, sender: "user" }];
    await processNextDialog(newSurvey, input, newMessages);
  };

  const handleDialogInput = async (input: string | Date | string[]) => {
    if (!conversationFlow) return;

    const inputLabel = Array.isArray(input)
      ? input
          .map((partialInput) =>
            LabelFormatter.getOptionLabel(
              conversationFlow.getCurrentDialog(),
              partialInput,
            ),
          )
          .join(", ")
      : LabelFormatter.getOptionLabel(
          conversationFlow.getCurrentDialog(),
          input,
        );

    const newMessages: Message[] = [{ text: inputLabel, sender: "user" }];
    await processNextDialog(conversationFlow, input, newMessages);
  };

  const processNextDialog = async (
    dialogFlow: EmotionalWellbeingDialog,
    input: string | Date | string[],
    newMessages: Message[],
  ) => {
    const inputValue =
      input instanceof Date ? DateValidator.formatDate(input) : input;
    console.log("inputValue:  ", inputValue);
    const nextDialog = await dialogFlow.processUserInput(inputValue);

    if (nextDialog?.introMessage) {
      newMessages.push({ text: nextDialog.introMessage, sender: "bot" });
    }

    if (nextDialog?.feedbackMessage) {
      newMessages.push({ text: nextDialog.feedbackMessage, sender: "bot" });
      const nextQuestion = dialogFlow.getNextDialog();
      if (nextQuestion?.introMessage) {
        newMessages.push({ text: nextQuestion.introMessage, sender: "bot" });
      }
      if (nextQuestion?.question) {
        newMessages.push({ text: nextQuestion.question, sender: "bot" });
      }
    }

    if (nextDialog?.question) {
      newMessages.push({ text: nextDialog.question, sender: "bot" });
    }

    addMessages(newMessages);
  };

  const renderCurrentDialogOptions = () => {
    if (!conversationFlow) {
      return <InputField onInput={handleIntroInput} />;
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
      case "single_choice":
        return (
          <SingleChoiceSelect
            options={currentDialog?.options}
            onInput={handleDialogInput}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    setMessages([{ text: helloDialog.question!, sender: "bot" }]);
    // eslint-disable-next-line
  }, []);

  return <Box>{renderCurrentDialogOptions()}</Box>;
};

export default DialogManager;
