# Dockerfile para produção - Backend ProjectoMC
FROM node:18-alpine

WORKDIR /app

# Dependências
COPY package*.json ./
RUN npm ci --only=production

# Código
COPY . .
COPY .env* ./ 2>/dev/null || true

EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "server.js"]
