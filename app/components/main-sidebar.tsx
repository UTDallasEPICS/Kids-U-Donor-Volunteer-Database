import React from "react";
import { List, ListItem, Link } from "@mui/material";
import NextLink from "next/link";

type SidebarItem = {
  name: string;
  reference: string;
};

type MainSidebarProps = {
  items: SidebarItem[];
};

export default function MainSidebar({ items }: MainSidebarProps) {
  if (!items || !Array.isArray(items)) {
    return <div>No sidebar items</div>;
  }

  return (
    <List sx={styles.container}>
      {items.map((item, index) => (
        <ListItem sx={{ px: 0.5 }} key={index}>
          <Link
            sx={styles.button}
            href={item.reference}
            component={NextLink}
            underline="none"
          >
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
