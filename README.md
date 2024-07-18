# Limbic Chatbot Project

<img src="https://github.com/user-attachments/assets/58f7fe38-9c48-418c-b978-58e73603f1fd" alt="chatbot" width="500">

## Tech Stack
- TypeScript
- NodeJS
- React
- Apollo GraphQL
- PostgreSQL
- Jest
- Knex
- Objection
- Material-UI

### Installation

1.Clone the repository:
```
git clone git@github.com:rebecalrocha/limbic-care-full-stack-challenge.git
cd limbic-care-full-stack-challenge
```
2. Install dependencies:
```
yarn install
```

3. Setup environment variables:

Create a .env file based on .env.example with the following configuration:

```
NODE_ENV=development
DB_HOST=db
DB_USER=user
DB_PASSWORD=Password!123
DB_NAME=limbic-chatbot
```

4. Start Docker containers:
```
cd app
docker-compose up --build
```
- This will start the backend application and PostgreSQL database. 
- Migrations and seeding will be automatically handled by the Docker setup.
- The backend server will be available at: http://localhost:4000

5. Start the frontend 

```
cd web-app
yarn install
yarn start
```

### GraphQL Playground

Apollo GraphQL Playground at http://localhost:4000/graphql.

### Project UML Diagram
At the root of the project, you can find a diagram.drawio file containing the UML diagram of the project. You can view this diagram using the draw.io extension installed in your preferred editor.
