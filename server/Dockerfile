# Base image
FROM node:14.14.0-alpine

# Setting a working directory to resolve node error v15
WORKDIR "/app"

# First copy pageage and install dependencies
COPY ./package.json ./
RUN npm install

# Then copy source code for project
COPY . .

# Default command for container (Production Env)
CMD ["npm", "run", "start"]