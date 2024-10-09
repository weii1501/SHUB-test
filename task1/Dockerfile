# Use the specific Node.js version as the base image
FROM node:20.14.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# # Expose the port the app runs on
# EXPOSE 7979

# Define the command to run the application
CMD ["yarn", "start"]