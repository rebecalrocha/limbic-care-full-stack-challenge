import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  onInput: (input: string | Date) => void;
  type?: "text" | "number" | "date";
}

const Dialog: React.FC<Props> = ({ onInput, type = "text" }) => {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onInput(input);
    setInput("");
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onInput(date);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        {type === "date" ? (
          <DatePicker onChange={(date) => handleDateChange(date)} />
        ) : (
          <TextField
            variant="outlined"
            value={input}
            size="small"
            fullWidth
            type={type}
            onChange={(e) => setInput(e.target.value)}
            sx={{ marginRight: "10px" }}
            autoComplete="off"
          />
        )}
        <Button variant="outlined" color="secondary" type="submit" size="large">
          <SendIcon />
        </Button>
      </form>
    </div>
  );
};

export default Dialog;
