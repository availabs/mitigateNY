FROM node:18.15.0

WORKDIR /app

COPY package.json .

COPY . .

CMD npm install --force && npm run start

EXPOSE 5173