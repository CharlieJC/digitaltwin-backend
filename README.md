DigitalTwin-Backend

# Environment vars

This project uses the following environment variables:

| Name        | Description               |
| ----------- | ------------------------- |
| JWT_SECRET  | Secret key for JWT auth   |
| PORT        | RESTful api endpoint port |
| DB_HOST     | typeorm database host     |
| DB_PORT     | typeorm database port     |
| DB_USERNAME | typeorm database username |
| DB_PASSWORD | typeorm database password |
| DB_NAME     | typeorm database name     |

# Pre-requisites

- Install [Node.js](https://nodejs.org/en/)
- Install [Docker](https://docs.docker.com/get-docker/)

# Getting started

- Clone the repository

```
git clone  https://github.com/CharlieJC/digitaltwin-backend.git
```

- Install dependencies

```
cd digitaltwin-backend
npm install
```

- Build and run the project

```
npm start
```

## Getting TypeScript

Add Typescript to project `npm`.

```
npm install -D typescript
```

### Running the build with docker

This project includes production and development docker compose files.
To run production:

```
docker-compose up
```

To run development:

```
docker-compose -f docker-compose.dev.yml up
```

### Running the build without docker

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script         | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `build`            | Compiles typescript into javascript in the ./build folder           |
| `start`            | Run the compiled javascript within the ./build folder               |
| `dev`              | Use nodemon to continuously compile and run code during development |
| `heroku-postbuild` | heroku deployment trigger to initiate build                         |
