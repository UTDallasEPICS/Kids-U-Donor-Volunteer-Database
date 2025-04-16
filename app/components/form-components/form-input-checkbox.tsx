import React from "react";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./form-input-props";

export const FormInputCheckbox: React.FC<FormInputProps> = ({ name, control, required, label, readOnly }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl size="small" variant="outlined" error={!!error}>
          <FormControlLabel
            required={required}
            control={<Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)} disabled={readOnly} />}
            label={label}
          />
        </FormControl>
      )}
    />
  );
};
