import { Controller } from "react-hook-form";
import { FormInputProps } from "./form-input-props";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

export const FormInputDate = ({
  name,
  control,
  label,
  required,
  sx,
}: FormInputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            sx={sx}
            label={label}
            slotProps={{
              textField: {
                required: required,
              },
            }}
            value={new Date(value)}
            onChange={onChange}
          />
        )}
      />
    </LocalizationProvider>
  );
};
