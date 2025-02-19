import React from "react";
import { List, ListItem, Link } from "@mui/material";
import NextLink from "next/link";

type ListItem = {
  name: string;
  reference: string;
};

const MainSidebarItems: ListItem[] = [
  { name: "Dashboard", reference: "/" },
  { name: "Constituents", reference: "/" },
  { name: "Donations", reference: "/donations" },
  { name: "Grants", reference: "/grants" },
  { name: "Volunteers", reference: "/Volunteers" },
];

export default function MainSidebar() {
  return (
    <List sx={styles.container}>
      {MainSidebarItems.map((item, index) => (
        <ListItem sx={{ px: 0.5 }} key={index}>
          <Link sx={styles.button} href={item.reference} component={NextLink} underline="none">
            {item.name}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}

const styles = {
  container: {
    backgroundColor: "#09111e",
    width: "8rem",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    color: "white",
    width: "100%",
    borderRadius: 1,
    p: 1,
    px: 0.5,
    fontSize: "0.95rem",
    "&:hover": { backgroundColor: "grey.600" },
  },
};
