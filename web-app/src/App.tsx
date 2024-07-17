import React, { useState } from "react";
import { Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import EmotionalWellbeingDialog from "./services/EmotionalWellbeingDialog";
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
  const [messages, setMessages] = useState<Message[]>([]);

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
