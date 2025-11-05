# 1. Imagem base
FROM node:alpine

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Copia arquivos de dependencias
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copia todo o codigo
COPY . .

# 6. Expoe a porta de acesso
EXPOSE 3000

# 7. Comandos de execucao
CMD ["npm", "start"]