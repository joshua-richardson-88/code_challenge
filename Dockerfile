FROM node:16
ARG DATABASE_URL

# Create app directory
WORKDIR /usr/src/app 

# Install app dependencies
COPY package*.json ./

# RUN npm install
RUN npm install

# Bundle app source 
COPY . .

RUN npm run generate


EXPOSE 80

CMD ["node", "dist/index.js"]