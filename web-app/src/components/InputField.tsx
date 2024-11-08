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

const InputField: React.FC<Props> = ({ onInput, type = "text" }) => {
  const [input, setInput] = useState<string | Date>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (type === "text" && (input as string).trim().length < 2) {
      return;
    }

    if (type === "number" && (input as string).trim().length < 8) {
      return;
    }

    if (
      type === "date" &&
      !(input instanceof Date && !isNaN(input.getTime()))
    ) {
      return;
    }

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
          value={input as string}
          size="small"
          type={type}
          color="secondary"
          onChange={handleInputChange}
          sx={{ marginRight: "10px" }}
          placeholder={type === "number" ? "+XX AAAA BBBBBBBB" : ""}
          autoComplete="off"
          fullWidth
        />
      )}
      <Button variant="outlined" color="secondary" type="submit">
        <SendIcon />
      </Button>
    </form>
  );
};

export default InputField;
