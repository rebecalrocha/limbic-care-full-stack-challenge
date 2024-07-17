import React, { useEffect, useRef } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import botImage from "../assets/bot.png";

interface Message {
  text: string;
  sender: "bot" | "user";
}

interface Props {
  messages: Message[];
}

const MessageDisplay: React.FC<Props> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
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
              backgroundColor: message.sender === "bot" ? "#F0F0F0" : "#BAAEF7",
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
  );
};

export default MessageDisplay;
