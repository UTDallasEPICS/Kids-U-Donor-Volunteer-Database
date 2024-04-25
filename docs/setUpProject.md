# Setting up the project

## 1. Install necessary programs
- Install [Git](https://git-scm.com/downloads)
- Install [VSCode](https://code.visualstudio.com/download)
    - Also install these VSCode Extensions
    - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
    - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Install [Docker](https://docs.docker.com/engine/install/)
- Install [Postgres](https://www.postgresql.org/download/)
- Install [Node.js](https://nodejs.org/en/download)
- Restart your computer


## 2. Clone repository
- Open VSCode
- Go to 'View > Command Palette'
- Enter git:clone
- Copy and paste the URL from the Kids-U repository
    - https://github.com/UTDallasEPICS/Kids-U-Donor-Volunteer-Database.git
    - Also in **<> Code** on the main page of the repository
- Select the location for the repository
- Open the repository in VSCode

## 3. Set up Postgres
- Open pgAdmin
    - This should be downloaded with Postgres, but if you do not have it, download it [here](https://www.pgadmin.org/download/)
- Keep the username of the master account as 'postgres'
- When prompted for a master password, enter a strong password without any special characters. **Make sure to remember this password**
- Under the default Postgres 16 server, create a new database and give it a name (e.g. testdb)

## 4. Setting up Prisma
- In VSCode, create a new .env file at the project repository root
- Copy the text from the .env.example file and paste into the .env file
- Change the 'PASSWORD' and 'NAME' variables to your account password and your database name
- In the VSCode terminal (open with 'Terminal > New Terminal' if necessary), run 'npm install -g prisma' 
- Restart your computer
- Then, in the VSCode terminal, run 'npx prisma generate' to initialize the database 

## 5. Start development server
- In the terminal, run 'npm install'
- Run 'npm install react dom'
For backend
- Run 'npm run build'
- Run 'npm start'
For frontend
- Open a new terminal
- Run 'cd frontend'
- Run 'npm start'
- When prompted to run the app on another port, answer yes
- Open http://localhost:3001 with your browser to see the result