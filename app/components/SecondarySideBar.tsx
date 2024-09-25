import Link from "next/link";

type ListItem = {
  name: string;
  reference: string;
};

export const SecondarySideBar = ({ items }: { items: ListItem[] }) => {
  return (
    <div className="bg-gray-700 text-white w-[7rem] min-h-screen flex flex-col">
      <ul className="flex flex-col space-y-2 p-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="hover:bg-gray-600 p-1 rounded cursor-pointer"
          >
            <Link href={item.reference}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
