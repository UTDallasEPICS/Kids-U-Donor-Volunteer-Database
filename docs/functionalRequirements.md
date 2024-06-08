# Functional Requirements

## This semester (Spring 2024)

### Grants Module 
#### Grants List Page
* Tracks and records all grants
* Lists information for each grant including organization’s name, grant name, status of the grant, amount requested, amount received, start date, and due dates, etc.
#### Grants Individual Page
* Tracks information for each grant as mentioned above.
* Admins need to be able to manually edit and update grant information.

### Database
* Stores information related to donors and donations 
  * Includes donor’s name, amount donated, type of donation, date, and the campaign or event associated with the donation 
* Stores information related to organizations and representatives
  * Includes organization's name, their representatives (name, contact details), website link, and location
* Stores information related to grants 
  * Includes the organization’s name, grant name, status of the grant, amount requested, amount received, start date, and due dates.
* Stores information related to constituents 
  * Includes personal information (names, addresses, contact details) 
* Stores information related to volunteers and events
  * Includes their name, age, address, email, emergency contact, agreement to media use and background check, and status regarding their training

## Future (the rest of the project)
Since these are to be implemented in the future, the requirements will be a bit broader (not listed by page but by modules)

#### General Administrative Dashboard  
* Administrators need to be able create an account 
* Administrators need to be able to log in to access the dashboard 
* After an administrator logs in, they shall be able to view several dashboards throughout the system that automatically provides visual graphics of the stored data 
* Creates a task list designed to help notify administration of new information that needs attention 
  * Can also set up reminders to get in touch with donors  
  * Can assign tasks to yourself or other users  
  * If any outstanding tasks exist, those will show up until marked as complete 

#### Donations Module 
* Tracks and keeps a record of all online donations 
* Allows offline donations to be manually logged 
  * Admins need to be able to log the donor’s name, the amount, the type of donation, date, and the campaign or event associated with it 
* Admins need to be able to add information to donation records 
* Admins need to be able to edit information in donation records 
* Admins need to be able to upload attachments and notes related to donations 

#### Grants Module 
* Tracks budget and expenses for each grant 
* Admins need to be able to upload attachments and notes related to grants 
* Admins shall be able to assign tasks for specific grants 

#### Constituents Module 
* Tracks and keeps a record of all constituents (donors, volunteers)  
* Creates a profile page for all constituents 
  * Includes personal and business information (names, addresses, contact details)  
  * Includes information regarding their donations
  * Includes information related to volunteer work (trainings, certifications) 
* Tracks all organizations
* Creates a page for each organization
  * Includes representatives and personal information (name, contact details)
  * Includes organization's name, location, and website link
* Admins need be able to add information
* Admins need be able to edit and update information
* Admins need to be able to search through the record of constituents and organizations

#### Volunteers Module 
* Event Registration 
  * Single time or reoccurring 
  * Sign up type (individual, group, group member) 
  * Customizable volunteer data registration pages, includes name, email, address, emergency contact, agreement to media use/background check, Training completion, age 
  * Includes a custom volunteer waiver  
* Volunteer registration pages 
  * A calendar view so volunteers can see all upcoming opportunities 
  * Form pages to collect information listed above
* Volunteer attendance 
  * Generates QR codes/links that can be used on site to confirm attendance 
  * Check in page that allows volunteers to tell their name and have it recorded 
  * Manually log attendance hours/people 

#### Events Module 
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

#### Reports Module 
* Dynamic reports 
  * Allow reports to be fully customizable where criteria can be handpicked for the end results desired 
  * Reports created will be saved  
  * Need to be able to go back to edit 
  * Need to be able to rerun reports 
* Provide for pre-loaded reports  
* Allow users to pull reports for other forms 
* Reports shall be able to be exported into Excel, PDF, or mailing list form 

#### Email Templates, Campaigns, and Marketing 
* Admins need to be able to send documents to constituents  
* Admins need to be able to send out acknowledgement emails or letters to donors 
* Custom email templates tied to certain events that can be triggered to send based on certain events, such as volunteer registration or a scheduled date before the event 
* Emails shall be able to have variables that can change based on the event or volunteer 
* Allow reports to be scheduled when to send in advance 
* Keep track of current campaigns and fundraising 
* Admins need to be able to add new campaigns 
  * Includes information such as campaign name, start and end dates, and goal amount 
* Campaign information shall be editable 

#### Database 
* Admins need to be able to backup the database
* Admins need to be able to import data from Excel spreadsheets





**Project Structure/Files**

These requirements must be met (in the main branch of your project) by the time your final report is due.

- [x]  The most up to date version of all frontend and backend code
- [x]  Database FilesIf using docker: docker-compose.yml at top level for project database.Database SchemaIf using Prisma: schema.prisma in a top level prisma folderIf using other database: A file with a descriptive name used to create your database schema (e.g. schema.sql)
- [ ]  .env.example file containing NON-SENSITIVE environment variables (Auth0 Issuer, dev database url, etc). Sensitive environment variables should be replaced with example data such as CLIENT_SECRET='EXAMPLE_CLIENT_SECRET' so that future groups know that the environment variable is required.
- [ ]  Figma design files in a top level folder named figma.
- [ ]  Any migration scripts, dev scripts, etc. (if any exist) belong in a top level scripts folder. If the project has separate frontend/backend folders, the scripts folder should be in the backend folder.
- [ ]  Any other important files should be included in an appropriately named folder (such as docs, documentation, notes, etc.).

**Documentation**

A README.md file at the top level containing the following:

- [x]  Conceptual overview - what is the project intended to accomplish?Include a broad description of the different types of users/roles and what they do.
- [x]  Functional requirements (broken down by page) - what are the discrete operations the app needs to be capable of?
- [ ]  Third party integrations and what they do in this project - HubSpot, Stripe, Auth0, etc.
- [x]  Tech StackInclude frontend framework (React, Vue, Svelte, etc.)Include backend framework (Express.js, etc.)If you use a meta framework, where the frontend and backend are combined, then you do not need to differentiate between frontend and backend (Next, Nuxt, Sveltekit, etc.)Database (PostgreSQL, MySQL, MongoDB, etc.)Other important packages (UI plugins, database connectors like prisma)Other tools used/needed (such as Postman)
- [ ]  Deployment notes (if project is currently or in the process of being deployed) - is the partner running the application on their own servers or are they using something like AWS or Azure?
- [ ]  Migration scripts - do we need to import any data from an existing system that the partner is using?
- [x]  ***Instructions for setting up the development environment!!!*** Assume that the needed software is already installed (Node.js, Docker, etc.).How do you start your project?How do you initialize the database?How do you set up authentication?Etc.

**Optional Additional Documentation**

In the repo's GitHub wiki, include the following:

- [ ]  List of user workflows (each different type of user)
- [ ]  Each workflow should have a corresponding wiki page, linked in the list, that either contains the workflow information or a TODO.
- [ ]  Each workflow should list the pages involved
- [ ]  List of user roles and what each role is able to do
- [ ]  Every third party integration should have its own page describing what parts of that service are used, how, and why
