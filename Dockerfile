FROM node:16
ARG EnvironmentVariable

# Create app directory
WORKDIR /usr/src/app 

# Install app dependencies
COPY package*.json ./

# RUN npm install
RUN npm install

# Bundle app source 
COPY . .

RUN npm run generate
RUN npm run seed


EXPOSE 80

CMD ["node", "dist/index.js"]