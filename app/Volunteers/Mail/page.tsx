import React from "react";
import { MailTable } from "./MailTable";

interface Message {
  ID: string;
  Event: string;
  Schedule: string;
}

const Mail: React.FC = () => {
  const peopleData: Message[] = [
    { ID: "123", Event: "Tutoring", Schedule: "Choose Event" },
    { ID: "124", Event: "Crime Watch", Schedule: "Choose Event" },
    { ID: "123", Event: "Clean Up", Schedule: "Select Recipients" },
  ];

  return (
    <div test-id="padding">
      <h1 className="text-2xl font-semibold text-gray-800">
        Volunteer Mail Messages
      </h1>
      <button className="bg-blue-500 text-white rounded-sm p-1">
        Create New Mail Message
      </button>
      <MailTable data={peopleData} />
    </div>
  );
};

export default Mail;
