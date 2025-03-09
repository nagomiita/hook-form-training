import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type ButtonInputProps = React.ComponentProps<"input"> & {
  label: string;
  type: string;
  onButtonClick: () => void;
};

function ButtonInput({ label, type, onButtonClick }: ButtonInputProps) {
  return (
    <div className="flex items-center gap-2">
      <TextField label={label} type={type} variant="outlined" fullWidth />
      <Button variant="contained" onClick={onButtonClick}>
        取得
      </Button>
    </div>
  );
}

export { ButtonInput };
