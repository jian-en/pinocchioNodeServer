FROM node:10-alpine

RUN npm i npm@latest -g


WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "test"]
