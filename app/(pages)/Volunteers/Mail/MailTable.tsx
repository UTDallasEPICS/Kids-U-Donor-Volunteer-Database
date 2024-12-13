// MailTable.tsx
import React from "react";
import Link from "next/link";

interface Message {
  ID: number;
  Event: string;
  Schedule: string;
  Subject: string;
  Sent: string;
  Active: string;
}

interface TableProps {
  data: Message[];
}

//   const MailTable = () => {
//     // Debugging
//     // if (!Array.isArray(mail)) {
//     //   return <div>Error: Mail is not an array</div>;
//     // }
//     return (
//     );
//   };

export const MailTable: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse mb-5">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100">ID</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Events</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Schedule</th>
            <th className="border border-gray-300 p-2 bg-gray-100">
              Email Subject
            </th>
            <th className="border border-gray-300 p-2 bg-gray-100">
              Emails Sent
            </th>
            <th className="border border-gray-300 p-2 bg-gray-100">Active</th>
            <th className="border border-gray-300 p-2 bg-gray-100"></th>
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
              <td className="py-2 px-4 border-b">{message.Subject}</td>
              <td className="py-2 px-4 border-b">{message.Sent}</td>
              <td className="py-2 px-4 border-b">{message.Active}</td>
              <td className="py-2 px-4 border-b">
                <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
