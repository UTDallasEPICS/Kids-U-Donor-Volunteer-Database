import { Controller } from "react-hook-form";
import { FormInputProps } from "./form-input-props";
import TextField from "@mui/material/TextField";

export const FormInputDate = ({ name, control, label, required, sx }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const dateValue = value ? new Date(value) : null;
        const iso = dateValue ? dateValue.toISOString().slice(0, 10) : "";
        return (
          <TextField
            sx={sx}
            label={label}
            required={required}
            type="date"
            value={iso}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
            InputLabelProps={{ shrink: true }}
          />
        );
      }}
    />
  );
};
