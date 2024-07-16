import React, { useState, useEffect, useRef } from "react";
import Dialog from "./components/Dialog";
import ConversationFlow from "./ConversationFlow";
import { Box, Typography, Avatar, Button, Container } from "@mui/material";
import botImage from "./assets/bot.png";

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
    if (conversationFlow) {
      addMessage(conversationFlow.getCurrentDialog().question || "", "bot");
    }
  }, [conversationFlow]);

  const addMessage = (text: string, sender: "bot" | "user") => {
    setMessages((prev) => {
      const { greetings, introMessage } =
        conversationFlow?.getCurrentDialog() || {};
      const extraMessages: Message[] = [];
      if (sender === "bot" && greetings) {
        extraMessages.push({ text: greetings, sender: "bot" });
      }
      if (sender === "bot" && introMessage) {
        extraMessages.push({ text: introMessage, sender: "bot" });
      }
      return [...prev, ...extraMessages, { text, sender }];
    });
  };

  const handleNameInput = (input: string | Date) => {
    const userInput = input.toString();
    const flow = new ConversationFlow(userInput);
    setConversationFlow(flow);
    addMessage(userInput, "user");
  };

  const handleDialogInput = (input: string | Date) => {
    if (!conversationFlow) return;

    addMessage(getOptionLabel(input), "user");

    const nextDialog = conversationFlow.processUserInput(input);
    if (nextDialog) {
      addMessage(nextDialog.question || "", "bot");

      if (nextDialog.nextMessage) {
        addMessage(nextDialog.nextMessage, "bot");
      }
    }
  };

  const getOptionLabel = (input: string | Date): string => {
    const currentDialog = conversationFlow!.getCurrentDialog();
    if (currentDialog.type === "multi_choice" && currentDialog.options) {
      const option = currentDialog.options.find((opt) => opt.value === input);
      if (option) return option.label;
    }
    return input.toString();
  };

  return (
    <Container
      sx={{ padding: 2, marginTop: 2, marginBottom: 2, maxWidth: "800px" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "78vh",
          overflowY: "auto",
          padding: 2,
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
              variant="body1"
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
          {conversationFlow.getCurrentDialog().type === "input" && (
            <Dialog onInput={handleDialogInput} />
          )}

          {conversationFlow.getCurrentDialog().type === "multi_choice" && (
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

          {conversationFlow.getCurrentDialog().type === "date" && (
            <Dialog onInput={handleDialogInput} type="date" />
          )}

          {conversationFlow.getCurrentDialog().type === "number" && (
            <Dialog onInput={handleDialogInput} type="number" />
          )}
        </Box>
      )}
    </Container>
  );
};

export default App;
