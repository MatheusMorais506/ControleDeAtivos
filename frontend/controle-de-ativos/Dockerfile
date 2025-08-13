FROM node:20-alpine AS build
WORKDIR /app

# Ignora certificados self-signed
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Build argument para a URL da API
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN rm -rf /root/.cache/next-swc

# Build do Next.js usa a variável acima
RUN npm run build

# Container final
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
