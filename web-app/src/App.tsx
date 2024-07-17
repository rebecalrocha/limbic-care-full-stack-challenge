import React, { useState, useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import EmotionalWellbeingDialog from "./services/EmotionalWellbeingDialog";
import { Container } from "@mui/material";
import MessageDisplay from "./components/MessageDisplay";
import DialogManager from "./components/DialogManager";

export interface Message {
  text: string;
  sender: "bot" | "user";
}

const App: React.FC = () => {
  const [conversationFlow, setConversationFlow] = useState<
    EmotionalWellbeingDialog | undefined
  >();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello, what's your name?", sender: "bot" },
  ]);

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth={false}
        sx={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <MessageDisplay messages={messages} />
        <DialogManager
          conversationFlow={conversationFlow}
          setConversationFlow={setConversationFlow}
          setMessages={setMessages}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default App;
