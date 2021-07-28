FROM node:14.17.1-buster
WORKDIR /opt/mockServer
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./ ./
CMD ["npm", "start"]
