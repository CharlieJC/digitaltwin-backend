# https://github.com/Sanjeev-Thiyagarajan/docker-typescript/blob/main/Dockerfile
# Installs Node.js image
FROM node:16-alpine AS build

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
WORKDIR /usr/src/app

COPY package*.json .

# Installs all packages
RUN npm install
# Copies everything
COPY . .

RUN npm run build

####################
####################


FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ["package*.json", ".env", "./"]

RUN npm ci --only=production

COPY --from=build /usr/src/app/build ./build

#better practice to run node directly instead of a script in production
CMD ["node","build/server.js"]

####################
####################

