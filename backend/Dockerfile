FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=dev

EXPOSE 3000

CMD ["npm", "run", "dev"]