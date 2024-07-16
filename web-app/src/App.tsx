import React, { useState, useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import Dialog from "./components/Dialog";
import ConversationFlow from "./ConversationFlow";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import botImage from "./assets/bot.png";
import { format } from "date-fns";
import SendIcon from "@mui/icons-material/Send";

interface Message {
  text: string;
  sender: "bot" | "user";
}

const App: React.FC = () => {
  const [conversationFlow, setConversationFlow] =
    useState<ConversationFlow | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello, what's your name?", sender: "bot" },
  ]);
  const [multiChoiceSelections, setMultiChoiceSelections] = useState<string[]>(
    [],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const currentDialog = conversationFlow?.getCurrentDialog();
    if (!currentDialog) return;

    const newMessages: Message[] = [];

    if (currentDialog.introMessage) {
      newMessages.push({ text: currentDialog.introMessage, sender: "bot" });
    }

    if (currentDialog.name === "start" && currentDialog.question) {
      newMessages.push({ text: currentDialog.question, sender: "bot" });
    }

    if (currentDialog.feedbackMessage) {
      newMessages.push({ text: currentDialog.feedbackMessage, sender: "bot" });
      conversationFlow?.moveToNext();
    }

    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  }, [conversationFlow, conversationFlow?.getCurrentDialog()]);

  const handleNameInput = (input: string | Date) => {
    const userInput = input.toString();
    const flow = new ConversationFlow(userInput);
    setConversationFlow(flow);
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

  const handleMultiChoiceChange = (optionValue: string) => {
    setMultiChoiceSelections((prevSelections) => {
      if (prevSelections.includes(optionValue)) {
        return prevSelections.filter((value) => value !== optionValue);
      } else {
        return [...prevSelections, optionValue];
      }
    });
  };

  const handleMultiChoiceSubmit = () => {
    handleDialogInput(multiChoiceSelections);
    setMultiChoiceSelections([]);
  };

  const addMessage = (text: string, sender: "bot" | "user") => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth={false}
        sx={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "80vh",
            overflowY: "auto",
            padding: 4,
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  message.sender === "bot" ? "flex-start" : "flex-end",
                mb: 2,
              }}
            >
              {message.sender === "bot" && (
                <Avatar src={botImage} alt="Bot" sx={{ mr: 2 }} />
              )}
              <Typography
                sx={{
                  backgroundColor:
                    message.sender === "bot" ? "#F0F0F0" : "#BAAEF7",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {message.text}
              </Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {!conversationFlow && <Dialog onInput={handleNameInput} />}

        {conversationFlow && (
          <Box>
            {conversationFlow.getCurrentDialog()?.type === "input" && (
              <Dialog onInput={handleDialogInput} />
            )}

            {conversationFlow.getCurrentDialog()?.type === "single_choice" && (
              <Box>
                {conversationFlow.getCurrentDialog().options?.map((option) => (
                  <Button
                    key={option.value}
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => handleDialogInput(option.value)}
                    sx={{ m: 1 }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>
            )}

            {conversationFlow.getCurrentDialog()?.type === "multi_choice" && (
              <Box>
                {conversationFlow
                  .getCurrentDialog()
                  .options?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          color="secondary"
                          checked={multiChoiceSelections.includes(option.value)}
                          onChange={() => handleMultiChoiceChange(option.value)}
                        />
                      }
                      label={option.label}
                      sx={{ m: 1 }}
                    />
                  ))}
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={handleMultiChoiceSubmit}
                  sx={{ m: 1 }}
                >
                  <SendIcon />
                </Button>
              </Box>
            )}

            {conversationFlow.getCurrentDialog()?.type === "date" && (
              <Dialog onInput={handleDialogInput} type="date" />
            )}

            {conversationFlow.getCurrentDialog()?.type === "number" && (
              <Dialog onInput={handleDialogInput} type="number" />
            )}
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default App;
