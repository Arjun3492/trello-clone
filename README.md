
# Task Management Application

This is a full-stack task management application built using React for the frontend and Express for the backend. The project includes user authentication and CRUD operations for tasks, which can be managed with drag-and-drop functionality.

## Features
1. User authentication (register, login)
2. Task management (create, read, update, delete)
3. Drag-and-drop functionality for tasks
4. User profile with avatar (Configured using AWS S3 Bucket)
5. Search tasks by title
6. Sort tasks
7. Test coverage for backend routes using Chai and Mocha

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v14 or higher)
- pnpm (v6 or higher)
- MongoDB (either locally or a cloud instance)

## Getting Started

### Setting Up the Backend


   
1. **Navigate to the server directory:**

   ```sh
   cd server
   ```

2. **Install the server dependencies:**

   ```sh
   pnpm install
   ```

3. **Create a `.env` file in the `server` directory with the following variables:**

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_aws_bucket_name
   ```

4. **Run the server:**

   ```sh
   pnpm start
   ```

   The backend server should now be running on `http://localhost:5000`.

### Setting Up the Frontend

1. **Navigate to the client directory:**

   ```sh
   cd client
   ```

2. **Install the client dependencies:**

   ```sh
   pnpm install
   ```

3. **Create a `.env` file in the `client` directory with the following variable:**

   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:5000
   ```

4. **Run the client:**

   ```sh
   pnpm start
   ```

   The frontend should now be running on `http://localhost:3000`.

## Usage

### User Authentication

- **Sign Up:** Register a new account.
- **Login:** Log into your account using the registered email and password.

### Task Management

- **Create Task:** Add a new task with title, description, due date, and category (To Do, In Progress, Done).
- **Edit Task:** Update the details of an existing task.
- **Delete Task:** Remove a task from the list.
- **Drag and Drop:** Move tasks between different categories.

### Profile

- **User Profile:** The user's profile including avatar, name, and email is displayed on the task management page.

## API Endpoints

### Authentication

- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login a user.

### User

- **GET** `/api/user`: Get the logged-in user's information.

### Tasks

- **GET** `/api/tasks`: Get all tasks for the logged-in user.
- **POST** `/api/tasks`: Create a new task.
- **PUT** `/api/tasks/:id`: Update an existing task.
- **DELETE** `/api/tasks/:id`: Delete a task.

