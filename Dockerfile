# Stage 1 - the build process
FROM node:10-alpine as build-deps
ENV WORKDIR=/home/node/ruuvi
ARG REACT_APP_API_ENPOINT
ARG REACT_APP_API_KEY
ENV REACT_APP_API_ENPOINT ${REACT_APP_API_ENPOINT}
ENV REACT_APP_API_KEY ${REACT_APP_API_KEY}
WORKDIR ${WORKDIR}
COPY package.json yarn.lock ./
RUN echo "-${REACT_APP_API_ENDPOINT}" 
RUN yarn
COPY . ./
RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.12-alpine
COPY --from=build-deps /home/node/ruuvi/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
