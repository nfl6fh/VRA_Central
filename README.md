This is a site built with NextJS, a PostgreSQL backend, and Prisma as an ORM.

## Getting Started
1) Clone the repo with `git clone https://github.com/nfl6fh/VRA_Central`
2) Get the `.env` file from Nate (nfl6fh@virginia.edu)
3) Run `cd VRA_Central` to navigate to the folder
4) Run `npm install` to install the necesary packages

## Developing
1) Run `yarn dev` to start the development server, probably at localhost:3000
2) Run `npx prisma studio` to view the ORM

## Common Errors
Too many Heroku connections
- often happens when you're refreshing a lot
- solution: run `heroku pg:killall -a VRA_Central`