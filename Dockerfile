FROM node:14-alpine

WORKDIR /var/jenkins_home/workspace/the-tiptop-api/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4100

# Commande de démarrage de votre application
# CMD ["node", "dist/index.js"]
# ou
CMD ["npm", "run", "start-with-seed"]
