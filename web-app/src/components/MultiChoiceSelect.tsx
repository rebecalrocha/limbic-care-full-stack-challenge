import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { DialogOption } from "../types/dialogTypes";

interface Props {
  options?: DialogOption[];
  onInput: (input: string | Date | string[]) => void;
}

const MultiChoiceDialog: React.FC<Props> = ({ options = [], onInput }) => {
  const [multiChoiceSelections, setMultiChoiceSelections] = useState<string[]>(
    [],
  );

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
    onInput(multiChoiceSelections);
    setMultiChoiceSelections([]);
  };

  return (
    <div>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              color="secondary"
              checked={multiChoiceSelections.includes(String(option.value))}
              onChange={() => handleMultiChoiceChange(String(option.value))}
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
    </div>
  );
};

export default MultiChoiceDialog;
