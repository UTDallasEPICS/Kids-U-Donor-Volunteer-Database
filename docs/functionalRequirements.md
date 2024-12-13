# Functional Requirements

## This semester (Fall 2024)

### Volunteer Module

#### Check-In / Check-Out Page

- Tracks and records check-in / check-out
- Check in page that allows volunteers to tell their name and have it recorded
- Manually log attendance hours/people

#### Registration Page

- Event Registration
  - Single time or reoccurring
  - Sign up type (individual, group, group member)
  - Customizable volunteer data registration pages, includes name, email, address, emergency contact, agreement to media use/background check, Training completion, age

#### Mail Page

- Allows for sending mail to multiple volunteers through the website
- Requires (currently non-functional) mail service

#### Event Creation Form

- Allows admins to create volunteer events and display them

#### Prisma Schema

- Prisma schema has been created - although database work has not begun.

### Grant Module
- Tracks and records all grants
- Admins need to be able to add information to grant records
- Admins need to be able to delete information to grant records
- Admins need to be able to edit information to grant records
- Admins need to be able to import/export information (documents, like a budget, or notes in .docx or .pdf format) to grant records

### Donation Module
- Tracks and records of all online donations
- Allows offline donations to be manually logged
- Creates donor profiles
- Admins need to be able to add information to donation records
- Admins need to be able to delete information to donation records
- Admins need to be able to edit information to donation records
- Admins need to be able to import/export information (documents or notes in .docx or .pdf format) to donation records

### General Administrative Dashboard
- Administrators need to be able create an account
- Administrators need to be able to log in to access the dashboard
- After an administrator logs in
    - Show graphics about grant and donation information
    - Navigation bar to donation and grants module

### Mailing
- Admins need to be able to access email and mailing addresses
- Needs to be able to send Thank You Letters/Receipts for donations
- Needs to be able to send acknowledgements for grants





## Past semester (Spring 2024)

### Grants Module

#### Grants List Page

- Tracks and records all grants
- Lists information for each grant including organization’s name, grant name, status of the grant, amount requested, amount received, start date, and due dates, etc.

#### Grants Individual Page

- Tracks information for each grant as mentioned above.
- Admins need to be able to manually edit and update grant information.

### Database

- Stores information related to donors and donations
  - Includes donor’s name, amount donated, type of donation, date, and the campaign or event associated with the donation
- Stores information related to organizations and representatives
  - Includes organization's name, their representatives (name, contact details), website link, and location
- Stores information related to grants
  - Includes the organization’s name, grant name, status of the grant, amount requested, amount received, start date, and due dates.
- Stores information related to constituents
  - Includes personal information (names, addresses, contact details)
- Stores information related to volunteers and events
  - Includes their name, age, address, email, emergency contact, agreement to media use and background check, and status regarding their training

## Future (the rest of the project)

Since these are to be implemented in the future, the requirements will be a bit broader (not listed by page but by modules)

### Database For Volunteers

- Stores information related to volunteers and events
  - Includes their name, age, address, email, emergency contact, agreement to media use and background check, and status regarding their training
- Allows for login
  - Flags users based on admin / volunteer roles, then allows for access to certain parts of the website.

#### General Administrative Dashboard

- Administrators need to be able create an account
- Administrators need to be able to log in to access the dashboard
- After an administrator logs in, they shall be able to view several dashboards throughout the system that automatically provides visual graphics of the stored data
- Creates a task list designed to help notify administration of new information that needs attention
  - Can also set up reminders to get in touch with donors
  - Can assign tasks to yourself or other users
  - If any outstanding tasks exist, those will show up until marked as complete

#### Donations Module

- Tracks and keeps a record of all online donations
- Allows offline donations to be manually logged
  - Admins need to be able to log the donor’s name, the amount, the type of donation, date, and the campaign or event associated with it
- Admins need to be able to add information to donation records
- Admins need to be able to edit information in donation records
- Admins need to be able to upload attachments and notes related to donations

#### Grants Module

- Tracks budget and expenses for each grant
- Admins need to be able to upload attachments and notes related to grants
- Admins shall be able to assign tasks for specific grants

#### Events Module

- Keeps track of any events
- Allow users to add new events
  - Includes information such as the event name, type, start date and time, end date and time, RSVP date, location, event status, general event description, and contact details
  - Track event planning and budget
  - Record list of participants
- Event information shall be editable
- Events shall be displayed using a calendar
  - Includes name of event with date and time
  - Includes event description
- Keep track of volunteers for each event
  - Link attending volunteers to records in volunteer module
  - Include contact information for each volunteer
- Allow guests to be added to events
  - Include contact information for each guest
- Allow users to add notes about the events

#### Reports Module

- Dynamic reports
  - Allow reports to be fully customizable where criteria can be handpicked for the end results desired
  - Reports created will be saved
  - Need to be able to go back to edit
  - Need to be able to rerun reports
- Provide for pre-loaded reports
- Allow users to pull reports for other forms
- Reports shall be able to be exported into Excel, PDF, or mailing list form

#### Email Templates, Campaigns, and Marketing

- Admins need to be able to send out acknowledgement emails or letters to donors
- Custom email templates tied to certain events that can be triggered to send based on certain events, such as volunteer registration or a scheduled date before the event
- Emails shall be able to have variables that can change based on the event or volunteer
- Allow reports to be scheduled when to send in advance
- Keep track of current campaigns and fundraising
- Admins need to be able to add new campaigns
  - Includes information such as campaign name, start and end dates, and goal amount
- Campaign information shall be editable

#### Database

- Admins need to be able to backup the database
- Admins need to be able to import data from Excel spreadsheets
