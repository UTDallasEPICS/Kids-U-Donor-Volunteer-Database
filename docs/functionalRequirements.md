# Functional Requirements

## Fall 2025 Semester

### Login & Authentication
- Must take email address, and password
- If 2fa on must go through 2fa process, entering code
- Must have functioning forgot password 
- Account creation must have secure password checks: Minimum Characters, numbers and symbols
- Asks for Full Name, Email, Double checks password
- Middleware must correctly route based on role (Volunteer/Admin)
- Volunteers may not access the admin side

### Profile Settings
- Must save profile picture, have ability to edit
- Must have ability to edit Name, Contact, Address
- Must update on the dashboard screen
- Must have ability to turn on 2fa
- Must have ability to reset password

### Admin Module
includes all database management of grant, donations, and volunteer info
#### Admin Dashboard
- Interface needs to be aligned & organized to Kids-U's preferance
- Must show visual graphic (graph, current statistics)
- Must follow the Kids-U branding with colors and logo
- Tasks List should be stored specific to admin user
- Key metrics should be accurate 
- Volunteer hours should be stored in progress bar and computed accurately
  - Super Admin may change the goal accordingly/set new goal

### Databases
- Filters based on catergories
  - Searchable Filter, Specific Filters for each  
- UI needs to be standard between other database pages
- Catergories must follow current Kids-U spreadsheets
- Has a method to add or show more catergories on the single page
  - Such as scrollable view or catergory adding area

#### Donations Database Tab:
##### Donations List Page 
- Database must show at least these catergories in a nice view such as Donor Type, Donor Name, Amount, Date, Campaign, Method, Type
##### Donors List Page
- Database must show at least these catergories in a nice view such as Donor Type,	Name,	Email, Phone, Total Donated,Last Donation,	Status
##### Add a Donation Page
This is a manual way to add donations to the donation database.
- Contains have three modes: Anonymous, New, Existing
- Anonymous/General contains Type(One-Time, Recurring, Pledge, In-kind (ask for item & value instead of donation)), Donation Amount, Payment Method (Credit card, Check, Bank Transfer, ACH, Cash, Paypal, Venmo, Zelle), Campaign, Fund, Date, Recurrence, Donation source, Matching Donation?, Tax deductible, Acknowledgement Sent?
- New contains Type(Individual, Corporate, Foundation), Communication Preference, Status, Retention, Notes, Contact Info, Address, General Donation Info
- Existing contains Donot Email and General Donation Info
- Simple UI form to fill out
##### Add a Donor
This is a manual way to add donors to the database.
This contains three types: Individual, Corporate, Foundation
-  Individual takes information such as: Communication Preference, Status, Retention, Notes, Individual Details(Name, Contact, Address)
- Corporate & Foundation takes: Communication Preference, Status, Retention, Notes, Organization Details(Name, Contact, Address)
##### Import Donations Data 
- Contains a draggable & clickable upload area
- Shows expected columns: Donor Type, Donor First Name, Donor Last Name, Email Address, Contact Number, Mailing Address, Preferred Contact Method, Company Name (if applicable), Donation Amount, Donation Method, Donation Date, Campaign/Event Name, Donation Frequency, Thank you/Follow Up Sent?
- May accept other types of columns as well 
- Takes in an excel file
- Must follow current Kids-U formatting

#### Grants Database Tab:
##### Grants List
- Contains columns for Grantor,	Representative,	Name,	Status,	Purpose,	Start Date,	End Date,	Award Notification Date,	Amount Awarded,	Amount Requested,	Proposal Due Date, Proposal Submission Date.
##### Grantor List
- Contains columns for Name,	Type,	Address Line 1,	Address Line 2,	City,	State,	Zipcode,	Communication Preference,	Recognition Preference.
##### Add a Grant
The manual way to add grant data into the grant list database.
- Must ask for Grantor, Name, Status, Amount Requested, Amount Awarded, Purpose, Internal Owner, Use Area, Dates, Multi-year grant?, Quarter, Proposal Due date, Application Type, Funding area, Acknowledgement sent, Eligible for Renewal?, Award Notification Date, Project submission due date, Proposal Summary, Funding Restrictions, Matching Requirements, Renewal application Date, Renewal Award Status
- Contains a way to add a new grantor asking for: Name, Title, Email, Contact, Address 
##### Grant Import
- contains draggable and clickable upload area
- Shows expected columns:Assigned, Quarter, Funder, Funding Area, Kids-U Program, Contact Type, LOI Due Date, Grant Due Date, Open-close dates, Funding Restrictions, Written Amount, Amount Awarded, Notes, Resources, Link for grant import
- May accept other types of columns as well 
- Takes in an excel file
- Must follow current Kids-U formatting

#### Volunteer Database Tab:
##### Volunteer Database List Page
Contains a running list of all volunteer users & registration status
-Should be able to click into all details of account, displaying all application information
-Ability to edit any information
- Catergories such as: Name, email, Regisration status, Action button 
##### View Registration Page
- Shows all current events
- Includes Name, Date, Time, Location, Registration amount, Button to access List of all volunteers
- Has Past event history access
- Must be able to edit event information here or remove
##### View Applications Page
Contains list of all current applications
- Should be sorted by pending to accepted with options to filter
- Must display: Name, Preferred Name, Email, Phone, Education, Accepted, Action Button to Change acceptance status
- Abilities to change pending status
- Ability to revert status: should ask twice to be sure
#### Export Page
Exports all current database information into a spreadsheet.
- Has ability to be filtered 
- Two types of exports: Grants & Donors
Grant Filters:
- Due date, Funding area, Min/Max awarded amount, status, Application type, Grantor Type
Donors Filters:
- Date, Donor Type, Status, Communication Preference, Fund Designation, Min/Max Amount, Payment, Campaign, Acknowledgement Sent, Recurring Frequency

#### Events Tab:
##### Add orientation page
- Form: Name, Orientation, Date, Time, Capacity, Location
- Must have ability to create location
- Must have ability to delete past locations
##### View Orientations page
Shows all current orientations
- Must have ability to see archived orientations
- Shows Name, Date, time, Location, Capacity (should show how full currently)
- Must have ability to edit Orientation information
- must have ability to click into Orientation information
##### Add event page
Form: Event Name, date, Time, Description, Location
- Ability to add a new location
- Ability to delete locations

#### Mail Page
This page is designated for emailing individuals, mass emails for: all volunteers, admins
- Must ask for Recipient Email
- Contains templates for reminders, thank-you, custom, announcment, fundraising, subject, message.
- Templates must be able to be edited
- Mass emails must send to all current volunteers or admins.
- Templates contain information that must be filled in.

### Volunteer Module
includes all information on volunteer account side
#### Dashboard Page
- Must use Kids-U Colors, Branding, Show logo
- Shows the social media and is hyperlinked
- Quick Buttons leading to other pages.
- Shows all current events they are signed up for
- Gives contact for any questions
- Shows event gallery with images
- Shows their current statistics such as hours and events attended

#### Event Registration Page
- Shows all current events
- Shows registered and unregistered status
- Shows event, date, time, location, description, action
- Has ability to unregister for events
- Shows notification for registering for event

#### Check-in/Check out
- Shows all current events registered for
- Has past event history
- Ability to log hours manually
- Shows Event Name, date, time, location, button
- There should not be a clock in/ clock out ability, It should be manual
- Hours should be verified by admins
#### Application Page
Application to apply to be a volunteer
- Must have personal information (Name, Maiden Name, SSN, Address, Email, Phone number), Do you speak Spanish?, Do you have a driver's license?, Are you a U.S. citizen or lawful permanent resident?, Contact, Education, Volunteer Questions, Background verification
-If submitted should show status, need to edit button, or delete application.
- When application becomes verified should set volunteer status
- Must follow Kids-U volunteer application
- Must ask for signature, certification checkbox, and date

### Super Admin Module
New role with ultimate authoritiy to be implemented for future
- Abilities to add other admin, or super admin
- Abilitiy to invite or create new admin account
- Abilities to add images to volunteer
- *contains ALL pages that admin role has
- Ability to set volunteer hour goal
- Ability to hard delete any data

## Past semester: (Fall 2024)

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

#### Event Creation Form

- Allows admins to create volunteer events and display them

#### Prisma Schema

- Prisma schema has been created - although database work has not begun.

### Grant / Donation Overall Requirements

#### Grant Module
- Tracks and records all grants
- Admins need to be able to add information to grant records
- Admins need to be able to delete information to grant records
- Admins need to be able to edit information to grant records
- Admins need to be able to import/export information (documents, like a budget, or notes in .docx or .pdf format) to grant records

#### Donation Module
- Tracks and records of all online donations
- Allows offline donations to be manually logged
- Creates donor profiles
- Admins need to be able to add information to donation records
- Admins need to be able to delete information to donation records
- Admins need to be able to edit information to donation records
- Admins need to be able to import/export information (documents or notes in .docx or .pdf format) to donation records

#### General Administrative Dashboard
- Administrators need to be able create an account
- Administrators need to be able to log in to access the dashboard
- After an administrator logs in
    - Show graphics about grant and donation information
    - Navigation bar to donation and grants module

#### Mailing
- Admins need to be able to access email and mailing addresses
- Needs to be able to send Thank You Letters/Receipts for donations
- Needs to be able to send acknowledgements for grants

## Past semester: (Spring 2024)

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
