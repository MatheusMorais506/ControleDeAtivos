FROM node:20-alpine AS build
WORKDIR /app

# Ignora certificados self-signed
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
