// Table.tsx
import React from "react";

interface Message {
  ID: string;
  Event: string;
  Schedule: string;
}

interface TableProps {
  data: Message[];
}

export const MailTable: React.FC<TableProps> = ({ data }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
            ID
          </th>
          <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
            Event
          </th>
          <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
            Schedule
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((message, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
          >
            <td className="py-2 px-4 border-b">{message.ID}</td>
            <td className="py-2 px-4 border-b">{message.Event}</td>
            <td className="py-2 px-4 border-b">{message.Schedule}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
