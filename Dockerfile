FROM node:16 as ts-compiler
ARG DATABASE_URL

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig*.json ./

# RUN npm install
RUN npm install

# Bundle app source 
COPY . ./

RUN npm run build
RUN npm run generate

EXPOSE 8080

CMD ["node", "dist/index.js"]