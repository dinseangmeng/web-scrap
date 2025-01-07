FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env.example .env

RUN npm install

RUN npm install -g dotenv

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
