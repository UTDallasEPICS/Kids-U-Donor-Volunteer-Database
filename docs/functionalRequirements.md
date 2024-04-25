# Functional Requirements

## This semester (Spring 2024)

### Grants Module 
* Tracks and records all grants 
  * Includes grant information regarding the organization’s name, grant name, status of the grant, amount requested, amount received, start date, and due dates 
* Tracks budget and expenses for each grant 
* Admins need to be able to manually edit and update grant information 
* Admins need to be able to upload attachments and notes related to grants 
* Admins shall be able to assign tasks for specific grants 

## For the rest of the project

General Administrative Dashboard  
* Administrators need to be able create an account 
* Administrators need to be able to log in to access the dashboard 
* After an administrator logs in, they shall be able to view several dashboards throughout the system that automatically provides visual graphics of the stored data 
* Creates a task list designed to help notify administration of new information that needs attention 
  * Can also set up reminders to get in touch with donors  
  * Can assign tasks to yourself or other users  
  * If any outstanding tasks exist, those will show up until marked as complete. 

Donations Module 
* Tracks and keeps a record of all online donations 
* Allows offline donations to be manually logged 
  * Admins need to be able to log the donor’s name, the amount, the type of donation, date, and the campaign or event associated with it 
* Admins need to be able to add information to donation records 
* Admins need to be able to edit information in donation records 
* Admins need to be able to upload attachments and notes related to donations 

Grants Module 
* Tracks and records all grants 
  * Includes grant information regarding the organization’s name, grant name, status of the grant, amount requested, amount received, start date, and due dates 
* Tracks budget and expenses for each grant 
* Admins need to be able to manually edit and update grant information 
* Admins need to be able to upload attachments and notes related to grants 
* Admins shall be able to assign tasks for specific grants 

Constituents Module 
* Tracks and keeps a record of all constituents  
* Creates a profile page for all constituents 
  * Includes personal and business information (names, addresses, contact details, organization affiliated with, etc.)  
  * Includes information regarding their donations and pledges 
  * Includes information related to volunteer work (trainings, certifications) 
* Admins need be able to add information to constituents’ profile 
* Admins need be able to edit and update information in constituents’ profile 
* Admins need to be able to search through the record of constituents 

Volunteers Module 
* Event Registration 
  * Single time or reoccurring 
  * Sign up type (Individual, Group, Group Member) 
  * Customizable Volunteer data registration pages, includes Name, Email, Address, Emergency contact, Agreement to media use/background check, Training completion, age 
  * Includes a custom volunteer waiver  
* Volunteer registration pages 
  * A calendar view so volunteers can see all upcoming opportunities 
  * Form pages to collect information listed above. 
* Volunteer attendance 
  * Generates QR codes/links that can be used on site to confirm attendance 
  * Check in page that allows volunteers to tell their name and have it recorded 
  * Manually log attendance hours/people 

Events Module 
* Keeps track of any events  
* Allow users to add new events 
  * Includes information such as the event name, type, start date and time, end date and time, RSVP date, location, event status, general event description, and contact details 
  * Track event planning and budget  
  * Record list of participants 
* Event information shall be editable 
* Events shall be displayed using a calendar  
  * Includes name of event with date and time 
  * Includes event description 
* Keep track of volunteers for each event 
  * Link attending volunteers to records in volunteer module 
  * Include contact information for each volunteer 
* Allow guests to be added to events 
  * Include contact information for each guest 
* Allow users to add notes about the events 

Reports Module 
* Dynamic reports 
  * Allow reports to be fully customizable where criteria can be handpicked for the end results desired 
  * Reports created will be saved  
  * Need to be able to go back to edit 
  * Need to be able to rerun reports 
* Provide for pre-loaded reports  
* Allow users to pull reports for other forms 
* Reports shall be able to be exported into Excel, PDF, or mailing list form 

Email Templates, Campaigns, and Marketing 
* Admins need to be able to send documents to constituents  
* Admins need to be able to send out acknowledgement emails or letters to donors 
* Custom email templates tied to certain events that can be triggered to send based on certain *events, such as volunteer registration or a scheduled date before the event 
* Emails shall be able to have variables that can change based on the event or volunteer 
* Allow reports to be scheduled when to send in advance 
* Keep track of current campaigns and fundraising 
* Admins need to be able to add new campaigns 
  *Includes information such as campaign name, start and end dates, and goal amount 
* Campaign information shall be editable 

Database 
* Stores information related to donations 
  * Includes donor’s name, amount donated, type of donation, date, and the campaign or event associated with the donation 
* Stores information related to grants 
  * Includes the organization’s name, grant name, status of the grant, amount requested, amount received, start date, and due dates 
* Stores information related to pledges 
  * Includes constituent name, pledge date, pledge amount, associated campaign, fund type (generic desired use), event, payment type, pledge status, and additional details 
* Stores information related to constituents 
  * Includes personal information (names, addresses, contact details, relationships) 
  * Includes business information regarding employment (organization name, affiliation) 
  * Includes information related to donations and pledges  
  * Includes information related to volunteer work (trainings, certifications) 
* Stores information related to volunteers 
  * Includes their name, age, address, email, emergency contact, agreement to media use and background check, and status regarding their training (if necessary). 
* Admins need to be able to backup the database 
* Admins need to be able to import data from spreadsheets and export data onto spreadsheets 