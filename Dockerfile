FROM node:12-alpine
WORKDIR /Ferris
COPY . .
RUN npm install -g typescript
RUN tsc
CMD ["node", "dist/app.js"]