FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install
EXPOSE 5000
CMD ["npm", "start"]