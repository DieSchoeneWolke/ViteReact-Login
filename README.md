# ViteReact-Login

This is an application using Vite and React to register and login a user using hashed access and refresh tokens stored in a MySQL database.


## Installation

- Clone this repo with `git clone https://github.com/DieSchoeneWolke/ViteReact-Login`.

- Setup your database with the `.sql` Scripts in `./init`.

- Create an `.env` file in the root directory of this repository including:

´´´
DB_HOST=
DB_USER=
DB_PASSWORD=
DB=user
JWT_SECRET=
LOG_LEVEL=INFO
´´´

- Install the node modules with `npm install --include=dev`.

- Build the Vite application with `npm build`.

- Run the node.js express server with `node ./src/backend/server.js`.

- Run the Vite application with `npm serve`.