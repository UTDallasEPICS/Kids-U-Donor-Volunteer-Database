import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  DonorState,
  PersonState,
  AddressState,
  DonationState,
  RequiredDonationState,
  RequiredDonorPersonState,
} from "../types/states";
import { useEffect, useState } from "react";

type FooterProps = {
  id: string;
  name: string;
  href: string;
  apiUrl: string;
  requiredError: RequiredDonationState | RequiredDonorPersonState;
  donation?: DonationState;
  donor?: DonorState;
  person?: PersonState;
  address?: AddressState;
};

export const Footer = ({
  id,
  name,
  href,
  apiUrl,
  requiredError,
  donation,
  donor,
  person,
  address,
}: FooterProps) => {
  const router = useRouter();

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    // Disable button after it has been pressed for 6 seconds
    const handleButtonDisable = () => {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 6000);
    };
    handleButtonDisable();
  }, [isButtonDisabled]);

  const handleSave = async () => {
    if (Object.values(requiredError).some((error) => error)) {
      alert("All fields must be filled.");
      return;
    }
    try {
      setIsButtonDisabled(true);

      let requestBody: string = "";

      if (donor && person && address) {
        requestBody = JSON.stringify({ donor, person, address });
      } else if (donation) {
        requestBody = JSON.stringify(donation);
      }

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${apiUrl}/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );

      if (!result.ok) {
        throw new Error("Error updating data");
      }
      alert("Successfully updated data.");
    } catch (error) {
      alert("Error updating data");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const remove = confirm(
      `Are you sure you would like to delete this ${name}?\nThis cannot be undone.`
    );

    if (remove) {
      try {
        setIsButtonDisabled(true);
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${apiUrl}/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!result.ok) {
          throw new Error(`Error deleting ${name} data`);
        }
        alert(`Successfully deleted ${name} data`);
        router.push(`/${href}`);
      } catch (error) {
        alert(`Error deleting ${href} data`);
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    router.push(`/${name}`);
  };

  return (
    <Box sx={styles.footerContainer}>
      <Button
        sx={styles.buttonContained}
        variant="contained"
        onClick={handleSave}
        disabled={isButtonDisabled}
      >
        Save
      </Button>
      <Button
        sx={styles.buttonContained}
        variant="contained"
        onClick={handleDelete}
        disabled={isButtonDisabled}
      >
        Delete
      </Button>
      <Button
        sx={styles.buttonOutlined}
        variant="outlined"
        onClick={handleCancel}
        disabled={isButtonDisabled}
      >
        Cancel
      </Button>
    </Box>
  );
};

const styles = {
  footerContainer: {
    display: "flex",
    gap: 1,
    py: 2,
  },
  buttonContained: {
    backgroundColor: "#1a345b",
  },
  buttonOutlined: {
    borderColor: "black",
    color: "black",
  },
};
