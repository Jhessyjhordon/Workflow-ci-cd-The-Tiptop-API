FROM node:14-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

# Commande de démarrage de votre application
# CMD ["node", "dist/index.js"]
# ou
CMD ["npm", "start"]
