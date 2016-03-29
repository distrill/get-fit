FROM node:argon

<<<<<<< HEAD
#Create app directory
=======
# Create app directory
>>>>>>> 48358cf
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
<<<<<<< HEAD
COPY package.json /usr/src/app
=======
COPY package.json /usr/src/app/
>>>>>>> 48358cf
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Environment variables
ENV MONGOLAB_URI mongodb://arthur:password@ds025239.mlab.com:25239/get-fit-dev

EXPOSE 8080
CMD [ "npm", "start" ]

