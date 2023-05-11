FROM node

WORKDIR /REST-API-PHONEBOOK-APP

COPY . .

RUN npm install 

EXPOSE 3000

CMD ["node", "server.js"]