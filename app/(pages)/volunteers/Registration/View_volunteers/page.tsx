"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const ViewVolunteers = () => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  // const data = searchParams.get('data');
  //   const { searchParams } = router.query;
  //   console.log(searchParams);
  const [eventData, setEventData] = useState(null);

  // const queryObject: Record<string, string> = {};

  // Use entries() to iterate over the key-value pairs
  // for (const [key, value] of searchParams.entries()) {
  //   queryObject[key] = value;
  // }

  // console.log(queryObject);

  useEffect(() => {
    const passedData = searchParams.get("data");
    console.log(passedData);
    if (passedData) {
      try {
        const parsedData = JSON.parse(passedData);
        setEventData(parsedData);
        // console.log(passedData);
        // console.log(parsedData);
      } catch (error) {
        console.error("Error parsing passed data:", error);
      }
    }
  }, [searchParams]);

  // if (!eventData) return <div>Loading...</div>;

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Registration</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">View Volunteers</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">View Volunteers Page</h1>
    </div>
  );

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
        {/* <pre>{JSON.stringify(queryObject, null, 2)}</pre> */}
        <p>Event Details: {JSON.stringify(eventData)}</p>
      </div>
    </div>
  );
};

export default ViewVolunteers;
