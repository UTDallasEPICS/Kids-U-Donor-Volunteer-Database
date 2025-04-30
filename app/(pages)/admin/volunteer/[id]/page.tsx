'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const VolunteerDetailsPage = () => {
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteerDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/admin/volunteer/${id}/get`);
        if (response.ok) {
          const data = await response.json();
          setVolunteer(data.volunteer);
        } else {
          console.error("Failed to fetch volunteer details");
        }
      } catch (error) {
        console.error("Error fetching volunteer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerDetails();
  }, [id]);

  if (loading) return <div>Loading volunteer details...</div>;

  if (!volunteer) return <div>Volunteer not found</div>;

  return (
    <div>
      <h1>Volunteer Details</h1>
      <h2>Personal Info</h2>
      <p><strong>First Name:</strong> {volunteer.firstName}</p>
      <p><strong>Middle Initial:</strong> {volunteer.middleInitial || "N/A"}</p>
      <p><strong>Last Name:</strong> {volunteer.lastName}</p>
      <p><strong>Address:</strong> {volunteer.addressLine}, {volunteer.city}, {volunteer.state}, {volunteer.zipCode}</p>
      <p><strong>Phone:</strong> {volunteer.phoneNumber}</p>
      <p><strong>Email:</strong> {volunteer.emailAddress}</p>

      <h2>Business or School Info</h2>
      <p><strong>Name:</strong> {volunteer.businessOrSchoolName || "N/A"}</p>

      <h2>Preferences & Skills</h2>
      <p><strong>Volunteer Preference:</strong> {volunteer.volunteerPreference}</p>
      <p><strong>Preferred Roles:</strong> {volunteer.preferredRoles.join(", ")}</p>
      <p><strong>Availability:</strong> {volunteer.availability.join(", ")}</p>
      <p><strong>Location:</strong> {volunteer.location.join(", ")}</p>
      <p><strong>Preferred Events:</strong> {volunteer.preferredEvents.join(", ")}</p>

      <h2>Compliance & Requirements</h2>
      <p><strong>Application Completed:</strong> {volunteer.volunteerApplicationCompleted ? "Yes" : "No"}</p>
      <p><strong>Background Check:</strong> {volunteer.backgroundCheckCompleted ? "Yes" : "No"}</p>
      <p><strong>Code of Ethics Form Signed:</strong> {volunteer.codeOfEthicsFormSigned ? "Yes" : "No"}</p>
      <p><strong>Abuse/Neglect Report Form Signed:</strong> {volunteer.abuseNeglectReportFormSigned ? "Yes" : "No"}</p>
      <p><strong>Personnel Policies Form Signed:</strong> {volunteer.personnelPoliciesFormSigned ? "Yes" : "No"}</p>
      <p><strong>Orientation Completed:</strong> {volunteer.orientationCompleted ? "Yes" : "No"}</p>
      <p><strong>Training Modules Completed:</strong> {volunteer.trainingModulesCompleted ? "Yes" : "No"}</p>

      <h2>Other Info</h2>
      <p><strong>ID:</strong> {volunteer.id}</p>
      <p><strong>Date Submitted:</strong> {new Date(volunteer.dateSubmitted).toLocaleDateString()}</p>
      <p><strong>Registration Status:</strong> {volunteer.registration ? "Registered" : "Not Registered"}</p>

      {/* Relations – optional deeper rendering depending on your needs */}
      <h2>Related Data</h2>
      <p><strong>Events Attended:</strong> {volunteer.volunteerEvents?.length || 0}</p>
      <p><strong>Hours Logged:</strong> {volunteer.eventHoursLogged?.length || 0}</p>
      <p><strong>Applications:</strong> {volunteer.application ? "Yes" : "No"}</p>
      <p><strong>Emergency Contact:</strong> {volunteer.EmergencyContact ? "Yes" : "No"}</p>
      <p><strong>Attendances:</strong> {volunteer.VolunteerAttendance?.length || 0}</p>
      <p><strong>Event Registrations:</strong> {volunteer.EventRegistration?.length || 0}</p>
      <p><strong>Mail Recipient:</strong> {volunteer.MailRecipient ? "Yes" : "No"}</p>
    </div>
  );
};

export default VolunteerDetailsPage;
