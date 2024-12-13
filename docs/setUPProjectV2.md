# Setting up the project

## 1. Install necessary programs

- Install [Git](https://git-scm.com/downloads)
- Install [Node.js](https://nodejs.org/en/download)
- Install [VSCode](https://code.visualstudio.com/download)
  - Also install these VSCode Extensions
  - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Install [Docker](https://docs.docker.com/engine/install/)
- Possibly restart your computer

## 2. Clone repository

- Open VSCode
- Go to `View > Command Palette`
- Enter git:clone
- Copy and paste the URL from the Kids-U repository
  - https://github.com/UTDallasEPICS/Kids-U-Donor-Volunteer-Database.git
  - Also in `<> Code` on the main page of the repository
- Select the location for the repository
- Open the repository in VSCode

- Alternatively, you can go into a folder you would like, open it in terminal and run: git clone https://github.com/UTDallasEPICS/Kids-U-Donor-Volunteer-Database

## 3. Setting up the environment

- In VSCode, create a new .env file at the project repository root
- Copy the text from the .env.example file and paste into the .env file
- Change the `PORT` to 5432, `USER`, `PASSWORD` and `DATABASE` to kidsu
- In the VSCode terminal, run `npm install`
- Open the docker application, then in the VSCode terminal, run `docker compose up -d`
- Again, in the VSCode terminal, run `npx prisma migrate dev` to initialize the database migrations (docker should still be open)

## 4. Start web application

- Run `npm run dev` in the terminal
- Go to [localhost:3000](http://localhost:3000/)

## 5. Miscellaneous

- Now you only have to do "npm run dev" every time you want to start the app. The Docker container also needs to be open in order to access database items, if there are any.
- "npx prisma migrate dev" only needs to run if changes to the prisma schema are made.
- There are currently no test files to run in order to import data for grants/grantors/donations/donors.
- Donations and Donors Add pages are working in order to add data that way, otherwise grants/grantors will need to be manually added.
- `npx prisma studio` can be used in order to manually make changes to the database, or external programs like Table Plus
