FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install -g serve

CMD ["serve", "-s", ".", "-l", "80"]
