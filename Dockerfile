# Frontend Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

# Install Rollup native binary for Alpine Linux
RUN npm install --no-save @rollup/rollup-linux-x64-musl

COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
