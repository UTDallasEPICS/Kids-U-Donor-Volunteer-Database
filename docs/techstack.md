# Our Techstack

## React

React is a tool to build both UI components and entire UIs.

- [React Documentation](https://react.dev/learn)

## Next.js

Next.js is a React framework that gives you the building blocks to create web applications.

- [Next.js Documentation](https://nextjs.org/docs)

## PostgreSQL

PostgreSQL serves as our underlying database engine for storing and managing data. Since we use Prisma, we do not need to interact directly with Postgres.

- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/)

## Prisma

Prisma is database Object Relational Mapper (ORM) used to connect our web application to the PostgresSQL database.

- [Prisma Documentation](https://www.prisma.io/docs)
- You can run `prisma studio` in the VSCode terminal to visualize the current data in the database.
- If you have an issue with Prisma, you might have forgotten to run `prisma migrate dev`
  - If running this causes an error, there is likely conflicting migrations
  - To resolve this issue, clear the migrations in the `\prisma\migrations` folder
  - Try `prisma migrate dev` again

## Docker

Go to this link in order to install Docker for your device:

- [Install Docker](https://docs.docker.com/get-started/get-docker/)
- Run `docker-compose up` to build the container.

## HTML, CSS, JavaScript/TypeScript,

This project utilizses JavaScript/TypeScript, HTML, and CSS.

- [HTML Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Libraries/DevTools

## jose
A modern library for signing and verifying JSON Web Tokens (JWT). We use this instead of jsonwebtoken because jose is compatible with the Next.js Edge Runtime (Middleware).
[jose Documentation](https://github.com/panva/jose)
- Used primarily in middleware.ts to validate user sessions and protect routes.

## Nodemailer
A module for Node.js applications to allow easy email sending. It acts as the "transport" mechanism to deliver 2FA codes and password reset links.
[Nodemailer Documentation](https://nodemailer.com/)
- This requires an SMTP configuration (host, port, user, pass) to function.

## MailTrap
Mailtrap is a fake SMTP server used for testing and development. It "traps" emails sent by Nodemailer so they don't go to real email addresses, allowing developers to inspect the content safely.
[MailTrap Documentation](https://mailtrap.io/fake-smtp-server/)
- Login to Mailtrap and copy the SMTP credentials into your .env file.
- When you send an email in development, check your Mailtrap Inbox to view the rendered HTML and verify the 2FA code.