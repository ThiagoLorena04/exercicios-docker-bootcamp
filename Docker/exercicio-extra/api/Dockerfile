FROM node:alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

# Para PROD 
FROM base AS prod

RUN npm install --only=production

COPY . .

# O comando "start" roda "node src/index.js"
CMD ["npm", "start"]

# Para DEV
FROM base AS dev

# O comando "dev" roda "nodemon src/index.js"
CMD ["npm", "run", "dev"]