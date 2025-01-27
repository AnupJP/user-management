# Use the Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the seed script first, then start the app
CMD ["sh", "-c", "node src/seeder/createAdminUser.js && node src/server.js"]
