<!-- tutorial -->
# Todo List API

This is a Todo List API built with TypeScript, Express, TypeORM, and SQLite in-memory database.

## Prerequisites

- Node.js, Typescript, Docker
- Yarn package manager

## Installation

1. Clone the repository

```bash
git clone https://github.com/weii1501/be-todolist.git
```

2. Change to the project directory
```bash
cd be-todolist
```

3. Install dependencies
```bash
yarn install
```

## Running the Application
1. Start the application
```bash
yarn start
```
2. Start the application in development mode
```bash
yarn dev
```

## Running Tests
1. Run the tests using Jest
```bash
yarn test
```
2. Run the tests using Postman
- You can use the TodoList.postman_collection.json file to import into Postman for testing.

## Environment Variables
The application uses the following environment variables:
- PORT: The port on which the server will run (default is 3000)
- NODE_ENV: it is an environment variable that stands for "Node Environment
```env
PORT=7979
NODE_ENV=dev
```

## How to Run the Application with Docker
1. Build and run the Docker container
- Use Docker Compose to build and run the application:
```bash 
docker-compose up --build
```

2. Access the application
- Once the container is successfully started, open your browser and navigate to:
```bash
http://localhost:7979
```

3. Stop the application
- To stop the container, press `Ctrl + C` in the terminal where Docker Compose is running, or use the following command:
```bash
docker-compose down
```

4. File Structure
- `Dockerfile`: Defines how to build the Docker image for the application.
- `docker-compose.yml`: Defines the Docker services and how they interact.
- `.dockerignore`: Lists the files and directories to be ignored when building the Docker image.

