# UTDesign EPICS Kids-U Donor Volunteer Database

<!-- markdownlint-disable-next-line MD033 -->
<details open><summary><h2>Table of Contents</h2></summary>

- [Overview](#overview)
- [Functional Requirements](docs/functionalRequirements.md)
- [Setting Up Project](docs/setUPProjectV2.md)
- [Techstack](docs/techstack.md)
- [Third Party Integrations](#third-party-integration)
- [Migration Scripts](#migration-scripts)
- [Figma](#figma)
- [Github Commands](docs/github-git-cheat-sheet.pdf)

</details>

## Overview

This project is focused on developing a database alongside a web application that will help Kids-U manage donors, both individual and organizations, and volunteers along with related funding (via donations and grants) and events. There will be three types of users: Super Admin, administrators and volunteers.

**Super Admin**

- Ability to manage users (role management, edit information, view all user info)
- All Admin Abilities

**Admin**

- Ability to manage and utilize data
- Ability to view all modules
- Ability to edit any module

**Volunteers**

- Can view registration, check in check out, and join activities within Volunteer module
- Can fill out the registration form

## Third Party Integration

Currently, we do not have any third party integrations. However, we do have Mailtrap for testing the email services.

## Migration Scripts

All of our migration scripts are located in the `prisma/migrations` folder.

## Figma

We have the figma files of all current dashboard & login flow designs.
We do not have the design of any specific database pages and refining for both the admin/volunteer side.

## Deployment

For the database, we don't have a specific seed script, as most of the current seed data is for testing purposes. However, we do have a `prisma/seed.ts` file that can be used to seed the database with initial data if needed.

Recommended data to seed include:

- At least one Super Admin user. This user will have the necessary permissions to promote subsequent "Volunteer" users to "Admin" users.
