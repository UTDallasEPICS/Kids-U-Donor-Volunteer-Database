import { MenuItem, Select, TextField, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/system";
import React from "react";

const TypographyStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  fontWeight: "bold",
  fontSize: "16px",
  color: "#333",
  marginBottom: "8px",
};

interface Props {
  title: string;
  type: "email" | "tel" | "text" | "date" | "password" | "dropdown" | "number";
  dropdown?: string[];
  width?: "S" | "M" | "L" | "XL";
}

const widthMap: Record<string, string> = {
  S: "165px",
  M: "200px",
  L: "350px",
  XL: "100%",
};

const GrantInformationInput: React.FC<Props> = ({
  title,
  type,
  dropdown,
  width = "M",
}) => {
  return (
    <Box
      sx={{
        width: widthMap[width] || "200px",
        display: "flex",
        flexDirection: "column",
        m: 1,
        p: 1,
      }}
    >
      <Typography sx={TypographyStyle}>{title}</Typography>
      {type === "dropdown" && dropdown ? (
        <Select
          sx={{ width: "100%", backgroundColor: "#fff", borderRadius: "5px" }}
        >
          {dropdown.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
          <MenuItem sx={{ backgroundColor: green[600] + "!important" }}>
            Add Option
          </MenuItem>
        </Select>
      ) : (
        <TextField
          type={type}
          variant="outlined"
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "5px",
          }}
        />
      )}
    </Box>
  );
};

export default GrantInformationInput;
