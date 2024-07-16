import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SendIcon from "@mui/icons-material/Send";
import { isValid, parseISO } from "date-fns";

interface Props {
  onInput: (input: string | Date) => void;
  type?: "text" | "number" | "date";
}

const Dialog: React.FC<Props> = ({ onInput, type = "text" }) => {
  const [input, setInput] = useState<string | Date>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onInput(input);
    setInput("");
  };

  const handleDateChange = (date: Date | null | string) => {
    if (typeof date === "string") {
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        setInput(parsedDate);
      }
    } else if (date instanceof Date && !isNaN(date.getTime())) {
      setInput(date);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const capitalizedInput =
      event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
    setInput(capitalizedInput);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        {type === "date" ? (
          <DatePicker
            onChange={(date) => handleDateChange(date)}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
            sx={{ marginRight: "8px" }}
          />
        ) : (
          <TextField
            variant="outlined"
            value={input}
            size="small"
            type={type}
            color="secondary"
            onChange={handleInputChange}
            sx={{ marginRight: "10px" }}
            placeholder={type === "number" ? "(99) 9999-9999" : ""}
            autoComplete="off"
            fullWidth
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
