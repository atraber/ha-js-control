ARG BUILD_FROM
FROM $BUILD_FROM

# Install Node.js
RUN apk add --no-cache nodejs npm

# Copy app files
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

RUN chmod a+x run.sh

CMD [ "/app/run.sh" ]
