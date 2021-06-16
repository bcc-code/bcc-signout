FROM node:14.17.1-buster
WORKDIR /opt/server
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
COPY ./.env ./.env
RUN npm run build
CMD ["npm", "start"]
