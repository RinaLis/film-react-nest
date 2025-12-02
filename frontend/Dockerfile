FROM node:20-alpine as build

WORKDIR /app

ARG VITE_API_URL
ARG VITE_CDN_URL

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CDN_URL=${VITE_CDN_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/nginx/ssl

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 