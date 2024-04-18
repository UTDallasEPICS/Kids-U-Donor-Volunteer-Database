# UTDesign EPICS Kids-U Donor Volunteer Database

The core technologies used are:

- [Next.js](https://nextjs.org): A full stack web development framework
- [Prisma](https://prisma.io): A database ORM used to connect Next.js to a database
- [PostgreSQL](https://www.postgresql.org): An open source SQL database

<!-- markdownlint-disable-next-line MD033 -->
<details><summary><h2>Table of Contents</h2></summary>

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
  - [Installing Node](#installing-node)
    - [Node for Windows](#node-for-windows)
    - [Node for Mac/Linux](#node-for-maclinux)
  - [Installing Docker](#installing-docker)
  - [Installing pnpm (recommended/optional)](#installing-pnpm-recommendedoptional)
  - [Installing PostgreSQL](#installing-postgresql)
  - [Installing Vue](#installing-vue)
  - [Installing Nuxt](#installing-nuxt)
- [Running This Project](#running-this-project)
- [Learn More](#learn-more)
  - [Learn HTML, CSS, JavaScript, and TypeScript](#learn-html-css-javascript-and-typescript)
    - [HTML](#html)
    - [CSS](#css)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
  - [Learn Next.js](#learn-nextjs)
  - [Learn Prisma](#learn-prisma)
- [Deploying This Project](#deploying-this-project)

</details>

## Getting Started

This is a database system with a web application that will contain various modules such as donations, grants, pledges, constituents, volunteer management, event management, and reports, along with dedicated features for campaigning and marketing through email communication. The users should be able to log into the system and contribute donations to Kids-U, while the administration should have the capabilities to view a list of all the donors with certain data fields, keep track of grant applications, get notified for upcoming grant deadlines, and other streamlined forms of management. As of now the grants module is complete with backend and frontend.   

Project Overview:

General Administrative Dashboard  

* Administrators need to be able create an account 
* Administrators need to be able to log in to access the dashboard 
* After an administrator logs in, they shall be able to view several dashboards throughout the system that automatically provides visual graphics of the stored data 
  * Examples include: viewing donor and dollar distribution, viewing the giving broken up by affiliation, viewing progress of campaigns, viewing top donors, etc. 
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
Pledges Module 
* Pledge Tracking 
  * Records information such as Constituent name, Pledge Date, Pledge Amount, Fund type (generic desired use), Event, Gift type (Check/Cash), whether the pledge is pending, Pledge details, etc. 
  * Includes credit card tracking to allow donors to pay over a period and make reoccurring payments 

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

## Prerequisites

In order to run this project, a few technologies are required:

- [Node.js](https://nodejs.org)
- [Docker](https://www.docker.com)
- [PostgreSQL](https://www.postgresql.org)
- [Prisma](https://www.prisma.io)
- [Vue](https://vuejs.org)
- [Nuxt](https://nuxt.com)

If you have these installed already, you can skip to [running this project](#running-this-project).

The project consists of database systems with a web application for administrators containing various modules. Our Tech stack consists of PostgreSQL, Prisma, Docker, Nuxt, and Vue. PostgreSQL serves as our underlying database engine for storing and managing data. Prisma is our intermediatory between the software and the database to safely and easily interact with a PostgreSQL database. Docker is used for containerization allowing our project to be more easily deployed across different environments. Nuxt is a more powerful form of JavaScript with enhanced functionality which works well with Vue. Finally, Vue is a JavaScript framework for more flexibly creating UIs. 

### Installing Node

#### Node for Windows

On windows, you can install node from the [Node.js downloads page](https://nodejs.org/en/download). Make sure you install the LTS (long-term support) version! Download and run the installer.

:warning: If shown a check box to install "tools for native modules" make sure you check the box before clicking next :warning:

Once the installation is finished (and you have restarted you computer if prompted), you can continue to [installing Docker](#installing-docker).

#### Node for Mac/Linux

It is recommended to use [node version manager (nvm)](https://github.com/nvm-sh/nvm) to install and run node on Mac/Linux. You can install is by using the command found [here](https://github.com/nvm-sh/nvm#installing-and-updating) in your terminal application. Alternatively, you can follow the installation instructions in the [windows instructions](#node-for-windows).

Once you have installed node version manager installed, run the following commands in your terminal:

```bash
nvm install --lts # Install latest version of Node.js
nvm install-latest-npm # Update npm to latest version
```

These commands do the following:

1. Install the long-term support (LTS) version of Node. The LTS version is the version of Node that will receive security updates the longest.
2. Update the node package manager (npm) to the latest version.

This completes your installation of Node!

### Installing Docker

Docker Desktop is the recommended way to install Docker. If you choose to install Docker another way, there is no guarantee that you will have everything installed correctly. To install docker desktop download and run the installer from [Docker's Getting Started Page](https://www.docker.com/get-started/).

### Installing pnpm (recommended/optional)

pnpm is an improved version of the Node Package Manager (npm). Though not required, it is highly recommended that you install it. You can install it using the following command in your terminal/powershell after node has been installed

```bash
npm install -g pnpm
```

If you choose to install pnpm, then you can substitute all usage of 'npm' with 'pnpm' and all usage of 'npx' with 'pnpx'. Additionally, you can create an alias in your `.bashrc` (Linux) or `.zshrc` (Mac) files. This will mean that when you type in npm or npx, pnpm and pnpx will be substituted. Use the following commands to add the aliases to the corresponding file:

```bash
# Linux
echo 'alias npm="pnpm"' >> .bashrc

# Mac
echo 'alias npm="pnpm"' >> .zshrc
```

### Installing PostgreSQL

To install PostgreSQL locally on your computer, visit [Install PostgreSQL](https://www.postgresql.org/download/), and download the newest version compatible with your operating system and follow the setup instructions.

### Installing Vue

To install and setup Vue on your device follow the instructions on [Vue Setup Instructions](https://vuejs.org/guide/quick-start)

### Installing Nuxt

To install and setup Nuxt on your device follow the instructions on [Nuxt Setup Instructions](https://nuxt.com/docs/getting-started/installation)

## Running This Project

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

### Learn HTML, CSS, JavaScript, and TypeScript

#### HTML

Websites are built using HTML, CSS, and JavaScript. HTML, or Hypertext Markup Language, is a markup language for the web that defines the structure of web pages[^1]. Examples of these structures include paragraphs, headings, headers, footers, lists, navigation, and images. Each one of these components is defined in an HTML file for every website you visit.

[^1]: [What is HTML - Definition and Meaning of Hypertext Markup Language by freeCodeCamp](https://www.freecodecamp.org/news/what-is-html-definition-and-meaning/)

#### CSS

#### JavaScript

#### TypeScript

### Learn Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Official Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Official Next.js with Prisma Example](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Learn Prisma

To learn more about Prisma, take a look at the following resources:

- [Prisma Documentation](https://www.prisma.io/docs)
- [Learn Prisma](https://www.prisma.io/learn)
- [Official Prisma Examples](https://github.com/prisma/prisma-examples)

## Deploying This Project
