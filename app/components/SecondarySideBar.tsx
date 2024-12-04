import NextLink from "next/link";
import { List, ListItem, Link } from "@mui/material";

type ListItem = {
  name: string;
  reference: string;
};

export const SecondarySideBar = ({ items }: { items: ListItem[] }) => {
  return (
    <List sx={styles.container}>
      {items.map((item, index) => (
        <ListItem sx={{ px: 0.5 }} key={index}>
          <Link sx={styles.button} href={item.reference} component={NextLink} underline="none">
            {item.name}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

const styles = {
  container: {
    backgroundColor: "#0d1a2d",
    width: "7rem",
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
