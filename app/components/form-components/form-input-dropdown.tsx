import { MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { FormInputSelectProps, MenuItemType } from "./form-input-props";

export const FormInputDropdown: React.FC<FormInputSelectProps> = ({
  name,
  control,
  label,
  required,
  sx,
  readOnly,
  menuItems = [],
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required." : false }}
      render={({ field: { onChange, value }, fieldState: { invalid, isDirty, error }, formState }) => (
        <TextField
          sx={sx}
          label={label}
          required={required}
          select
          error={!!error}
          helperText={error ? error.message : null}
          onChange={onChange}
          value={value}
          slotProps={{
            input: {
              readOnly: readOnly,
            },
          }}
        >
          {menuItems.map((item: MenuItemType) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};
