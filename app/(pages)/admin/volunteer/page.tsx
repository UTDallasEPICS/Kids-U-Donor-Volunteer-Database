'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  registration: boolean;
}

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch("/api/admin/volunteer/get");
        if (response.ok) {
          const data = await response.json();
          setVolunteers(data.volunteers);
        } else {
          console.error("Failed to fetch volunteers");
        }
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleViewDetails = (id: string) => {
    router.push(`/admin/volunteer/${id}`);
  };

  if (loading) {
    return <div>Loading volunteers...</div>;
  }

  return (
    <div>
      <h1>Volunteers List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Registration Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((volunteer) => (
            <tr key={volunteer.id}>
              <td>{`${volunteer.firstName} ${volunteer.lastName}`}</td>
              <td>{volunteer.emailAddress}</td>
              <td>{volunteer.registration ? "Registered" : "Not Registered"}</td>
              <td>
                <button onClick={() => handleViewDetails(volunteer.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteersPage;
