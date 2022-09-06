FROM node:16

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

ARG DATABASE_URL
ARG PORT

EXPOSE 80

CMD ["node", "dist/index.js"]