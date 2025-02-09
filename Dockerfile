FROM node:18-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install

# Build
COPY . .
RUN npm run build

# Runtime
EXPOSE 3000
CMD ["npm", "start"] 