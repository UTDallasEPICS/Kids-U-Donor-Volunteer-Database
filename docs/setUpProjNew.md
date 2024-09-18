
# Setting up the project

## 1. Install necessary programs
- Install [Node.js](https://nodejs.org/en/download)
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
    - You don't need to sign in, just download and open the app
- (Optional) Download a database viewer like:
    - [TablePlus](https://tableplus.com/) for a simple interface to view your database
    - You can also use pgAdmin, psql, or any tool of your choice
    - **Database credentials (host/user/password/db name):** `kidsu`

## 2. Clone repository and update
- If you already cloned the repository, go to the terminal in the project folder and run:
  ```bash
  git pull origin billybranch
  ```

## 3. Install dependencies
- In the project folder, run:
  ```bash
  npm install
  ```
  This will install all the required dependencies for the project.

## 4. Create `.env` file
- Manually create a `.env` file in the project root.
- Copy the contents from `.env.example` and update the `PRISMA_DB_URL` with the provided URL:
  ```bash
  PRISMA_DB_URL="postgresql://kidsu:kidsu@localhost:5432/kidsu"
  ```

## 5. Setup Docker and Prisma
- Ensure Docker Desktop is open.
- In the terminal, run:
  ```bash
  docker-compose up -d
  ```
  This will set up the necessary services using Docker.
- Then, run:
  ```bash
  npx prisma migrate dev
  ```
  This will initialize the database.

## 6. Start development server
#### Install necessary packages
- In the terminal, run:
  ```bash
  npm install
  ```
    - Open a new terminal.
    - Run `cd frontend`.
    - Run `npm install` and `npm install react dom` again.

#### After everything is installed
For the database:
- Run `prisma migrate dev` (if you have not run it yet).

For the backend:
- Make sure you're at the root of the project, not in `/frontend`.
- Run:
  ```bash
  npm run dev
  ```
  It should be available at `http://localhost:3000`.

Then, for the frontend:
- Open a new terminal (if you do not have a second one opened already).
- Run:
  ```bash
  cd frontend
  ```
- Run:
  ```bash
  npm start
  ```
  When prompted to run the app on another port, answer yes.
    - Open `http://localhost:3001` with your browser to see the web application.

## 7. Add test data (optional)
- To populate the database with test data, run:
  ```bash
  node test.js
  ```
- You can check if the data is correctly added by loading the website or viewing the database in TablePlus or any database viewer.
