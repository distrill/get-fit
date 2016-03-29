FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Environment variables
ENV MONGOLAB_URI mongodb://arthur:password@ds025239.mlab.com:25239/get-fit-dev

EXPOSE 8080
CMD [ "npm", "start" ]

