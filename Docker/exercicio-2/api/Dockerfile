# Imagem base
FROM node:alpine

# Repositorio dentro do container
WORKDIR /app 

# Copia arquivos e depedencias 
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copia todo o codigo 
COPY . .

# Expoe a porta de acesso da API
EXPOSE 3000

# Comandos de execucao
CMD ["npm", "start"]