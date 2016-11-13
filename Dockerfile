FROM node:6.9.1-onbuild

# Create app directory
RUN mkdir -p /usr/src/app
VOLUME /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --global gulp-cli
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000 3001 7000
CMD [ "gulp", "browser-sync" ]