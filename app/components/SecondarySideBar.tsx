import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

type ListItem = {
  name: string;
  reference: string;
};

export const SecondarySideBar = ({ items }: { items: ListItem[] }) => {
  return (
    <Box
      sx={{
        backgroundColor: "grey.700",
        color: "white",
        minHeight: "100vh",
        justifyContent: "flex-start",
      }}
    >
      <List sx={{ padding: 0 }}>
        {items.map((item, index) => (
          <ListItem sx={{ padding: 1 }} key={index}>
            <ListItemButton
              component={Link}
              href={item.reference}
              sx={{
                "&:hover": { backgroundColor: "grey.600" },
                borderRadius: 1,
                padding: .5,
                paddingLeft: 1,
                width:"7rem"
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
