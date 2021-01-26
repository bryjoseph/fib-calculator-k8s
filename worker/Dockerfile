# Base image
FROM node:alpine

# Setting a working directory to resolve node error v15
WORKDIR "/app"

# First copy package.json and install dependencies
COPY ./package.json ./
RUN npm install

# Then copy source code for project
COPY . .

# Default command for container (Production Env)
CMD ["npm", "run", "start"]