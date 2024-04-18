import { useState, useEffect } from 'react';
import axios from 'axios';

function MyComponent() {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    // Fetch all organizations when the component mounts
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('https://localhost:3000/api/organizations');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const createOrganization = async () => {
    try {
      const response = await axios.post('/api/organizations/create', {
        // Provide organization data here
      });
      console.log('Organization created:', response.data);
      // After creating organization, fetch all organizations again to update the list
      fetchOrganizations();
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const deleteOrganization = async (organizationId) => {
    try {
      const response = await axios.delete(`/api/organizations/${organizationId}`);
      console.log('Organization deleted:', response.data);
      // After deleting organization, fetch all organizations again to update the list
      fetchOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  return (
    <div>
      <h1>Organizations</h1>
      <ul>
        {organizations.map((organization) => (
          <li key={organization.OrganizationID}>
            {organization.OrganizationName} - {organization.WebsiteForFunder}
            <button onClick={() => deleteOrganization(organization.OrganizationID)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={createOrganization}>Create Organization</button>
    </div>
  );
}

export default MyComponent;
