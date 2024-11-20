import { MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { FormInputSelectProps, MenuItemType } from "./FormInputProps";

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
      render={({
        field: { onChange, value },
        fieldState: { invalid, isDirty, error },
        formState,
      }) => (
        <TextField
          sx={sx}
          label={label}
          required={required}
          select
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
