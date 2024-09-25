# Setting up the project

## 1. Install necessary programs
- Install [Git](https://git-scm.com/downloads)
- Install [VSCode](https://code.visualstudio.com/download)
    - Also install these VSCode Extensions
    - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
    - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Install [Docker](https://docs.docker.com/engine/install/)
- Install [Node.js](https://nodejs.org/en/download)
- Restart your computer


## 2. Clone repository
- Open VSCode
- Go to `View > Command Palette`
- Enter git:clone
- Copy and paste the URL from the Kids-U repository
    - https://github.com/UTDallasEPICS/Kids-U-Donor-Volunteer-Database.git
    - Also in `<> Code` on the main page of the repository
- Select the location for the repository
- Open the repository in VSCode


## 4. Setting up Prisma
- In VSCode, create a new .env file at the project repository root
- Copy the text from the .env.example file and paste into the .env file
- Change the `PASSWORD` and `NAME` to your account password and your database name
- In the VSCode terminal (open with `Terminal > New Terminal` if necessary), run `npm install -g prisma`
- Restart your computer
- Then, in the VSCode terminal, run `prisma migrate dev` to initialize the database 

## 5. Start development server
#### Install necessary packages
- In the terminal, run `npm i`
- Run `docker container`
- Run `docker compose up -d`
- Run `npx prisma migrate dev`
- Disregarding the error, Run `cp .env.example .env` and `nano .env` after.
- npm run dev
- In chrome go to http://localhost:3000/GrantsPage
