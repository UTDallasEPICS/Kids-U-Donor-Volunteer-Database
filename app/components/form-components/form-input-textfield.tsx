import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { FormInputTextProps } from "./form-input-props";
import { InputAdornment } from "@mui/material";

export const FormInputTextfield = ({
  name,
  control,
  label,
  required,
  sx,
  maxLength,
  fullWidth,
  multiline,
  rows,
  type,
  readOnly,
}: FormInputTextProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required." : false }}
      render={({
        field: { onChange, value },
        fieldState: { invalid, isDirty, error },
        formState,
      }) => {
        const handleZip = (event: React.ChangeEvent<HTMLInputElement>) => {
          const cursorPosition = event.target.selectionStart;

          if (!isNaN(Number(event.target.value))) {
            onChange(Number(event.target.value).toString().slice(0, 5));

            setTimeout(() => {
              event.target.selectionStart = event.target.selectionEnd =
                cursorPosition;
            }, 0);
          }
        };

        const handleCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
          const val = event.target.value;

          // Allow only numbers or a period
          const num = val.replace(/[^0-9.]/g, "");

          // Allow only one period
          const numSplit = num.split(".");
          const formattedNum =
            numSplit.length > 2
              ? `${numSplit[0]}.${numSplit.slice(1).join("")}`
              : num;

          // Remove leading zero case
          if (
            formattedNum.startsWith("0") &&
            formattedNum.length > 1 &&
            formattedNum[1] !== "."
          ) {
            onChange(parseFloat(formattedNum.substring(1)));
            return;
          }

          // Case of empty string or just period, reset to 0
          if (formattedNum === "" || formattedNum === ".") {
            onChange(0);
            return;
          }
          onChange(formattedNum);
        };

        let onChangeHandler;
        switch (type) {
          case "zip":
            onChangeHandler = handleZip;
            break;
          case "currency":
            onChangeHandler = handleCurrency;
            break;
          default:
            onChangeHandler = onChange;
        }

        return (
          <TextField
            sx={sx}
            label={label}
            required={required}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={rows}
            error={!!error}
            helperText={error ? error.message : null}
            onChange={onChangeHandler}
            value={value}
            slotProps={{
              input: {
                startAdornment:
                  type === "currency" ? (
                    <InputAdornment position="start">$</InputAdornment>
                  ) : null,
                readOnly: readOnly,
              },
              htmlInput: {
                ...(maxLength ? { maxLength: maxLength } : {}),
              },
            }}
          />
        );
      }}
    />
  );
};
