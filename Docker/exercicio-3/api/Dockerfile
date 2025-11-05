# Define uma base comum para 'dev' e 'prod'
FROM node:alpine AS base
WORKDIR /app

# Copia apenas o package.json para otimizar o cache
COPY package*.json ./

#Para PROD
# Este estágio builda a imagem final de produção
FROM base AS prod

# Instala somente as dependências de produção
RUN npm install --only=production

# Copia o resto do código-fonte
COPY . .

# O comando padrão para rodar a aplicação em produção
CMD ["npm", "start"]

# para o ambiente de 'dev'
FROM base AS dev

# Instala TODAS as dependências, incluindo devDependencies
RUN npm install

# Copia o resto do código-fonte (embora o volume vá sobrescrevê-lo)
COPY . .

# O comando padrão para rodar em modo de desenvolvimento
CMD ["npm", "run", "dev"]