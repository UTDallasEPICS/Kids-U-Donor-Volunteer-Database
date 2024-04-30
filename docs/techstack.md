# Our Techstack

## React
We utilized React for our frontend.
- [React Documentation](https://react.dev/learn)

## Next.js
We utilized Next.js for our backend.
- [Next.js Documentation](https://nextjs.org/docs)

## PostgreSQL
PostgreSQL serves as our underlying database engine for storing and managing data. Since we use Prisma, we do not need to interact directly with Postgres.
- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/)

## Prisma
Prisma is database Object Relational Mapper (ORM) used to connect our web application to the PostgresSQL database.
- [Prisma Documentation](https://www.prisma.io/docs)
- You can run `prisma studio` in the VSCode terminal to visualize the current data in the database.

## Docker
Follow the installation procedures below to setup Docker:
- [Install Docker](https://www.docker.com/get-started/)
- Run `docker-compose up` to build the container.

# Backend
## Typescript
Our backend utilizes mostly Typescript. 
- [Typescript Documentation](https://www.typescriptlang.org/docs/)
- Run `npm install -g typescript` to install Typescript globally
- To run a Typescript file in VSCode, 
    - Run `tsc yourFileName.ts`
    - Then run `node yourFileName.js`

# Frontend
## HTML, CSS, JavaScript,
Our frontend mostly consists of HTML, CSS, JavaScript. 
- [HTML Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Javacript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

Why Javacript instead of Typescript?

Our frontend team decided using Javascript would be easier, while our backend team decided to use Typescript.

## Axios
Axios is a Javascript library we use to help make API calls to our database.
- [Axios Documentation](https://axios-http.com/docs/intro)