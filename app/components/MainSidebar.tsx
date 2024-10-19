import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from '@mui/material/Button';

const sidebarButtonStyle = ({
  color:"white", 
  width:"8rem", 
  justifyContent: "flex-start",
  padding: 1,
  "&:hover": { backgroundColor: "grey.600"}
});

export default function MainSidebar() {
  return (
    <Box sx={{backgroundColor: "grey.800", minHeight: "100vh", padding: 0}}>
      <List sx={{ padding: 1 }}>
        <Button sx={sidebarButtonStyle} href="/">Dashboard</Button>
      </List>
      <List sx={{ padding: 1 }}>
        <Button sx={sidebarButtonStyle} href="/Constituents">Constituents</Button>
        </List>
      <List sx={{ padding: 1 }}>
        <Button sx={sidebarButtonStyle} href="/Donations">Donations</Button>
        </List>
      <List sx={{ padding: 1 }}>
        <Button sx={sidebarButtonStyle} href="/Grants">Grants</Button>
        </List>
    </Box>
  );
}
