# Build Phase pt1: Base image
FROM node:alpine as builder

# Build Phase pt2: Working directory to resolve node v15 build error
WORKDIR '/app'

# Build Phase pt3: Copy over dependency file to working dir
COPY ./package.json ./

# Build Phase pt4: then install dependencies
RUN npm install

# Build Phase pt5: AFTER installing dependencies THEN get source code
COPY . .

# Build Phase pt6: Provide default command for container startup
RUN npm run build
# This command produces a production build folder within the WORKDIR called build

# Run Phase pt1: Second base image for production build of web app
FROM nginx

# Run Phase pt2: Expose port of / requests not /api/ requests
EXPOSE 3000

# Run Phase pt3: Bring over nginx default.conf file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Run Phase pt4: Copy over folder from npm build from first step with from=0
COPY --from=builder /app/build /usr/share/nginx/html