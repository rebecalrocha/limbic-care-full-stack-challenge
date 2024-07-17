import React from "react";
import Button from "@mui/material/Button";
import { DialogOption } from "../types/dialogTypes";

interface Props {
  options?: DialogOption[];
  onInput: (input: string | Date | string[]) => void;
}

const SingleChoiceDialog: React.FC<Props> = ({ options = [], onInput }) => {
  return (
    <div>
      {options.map((option) => (
        <Button
          key={option.value}
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => onInput(String(option.value))}
          sx={{ m: 1 }}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default SingleChoiceDialog;
