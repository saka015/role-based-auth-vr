# Role-Based Authentication System

## Overview

This project is a full-stack application providing secure user management with role-based access control (RBAC).  It allows for user registration, login, and the management of users and roles by authorized administrators.

## Features

### Authentication

* User registration with email verification (optional).
* Secure login with password hashing (bcrypt).
* Password reset functionality via email.
* JWT (JSON Web Tokens) for secure session management.

### User Management

* CRUD (Create, Read, Update, Delete) operations for users.
* User profile management (update personal information).
* Role assignment to users.

### Role & Permission Management

* CRUD operations for roles.
* Define permissions associated with each role.
* Granular control over access to specific features based on assigned permissions.

### Admin Panel

* Dedicated admin interface for managing users and roles.
* Comprehensive logging of user actions (audit trail).
* Send Emails to new users





## Technologies Used

### Frontend

* React.js
* Vite (build tool)
* React Router DOM for navigation
* Ant Design for UI components
* Axios for API calls
* SweetAlert2 for user alerts


### Backend

* Node.js with Express.js framework
* MongoDB (database)
* Mongoose (MongoDB ODM)
* bcrypt (password hashing)
* jsonwebtoken (JWT)
* multer (file uploads - if applicable)
* nodemailer (email sending - if applicable)
* body-parser (for parsing request bodies)
* cors (for handling Cross-Origin Resource Sharing)
* dotenv (for environment variables)
* express-validator (input validation)

## Setup

### Prerequisites

* Node.js and npm (or yarn) installed.
* MongoDB instance running (or configured for connection).

### Installation

1. **Clone the repository:**

   ``` 
   git clone <repository_url>
Use code with caution.
Markdown
Navigate to the client directory:

cd client
Use code with caution.
 
Install client-side dependencies:

npm install
Use code with caution.
 
Navigate to the server directory:

cd ../server
Use code with caution.
 
Install server-side dependencies:

npm install
Use code with caution.
 
Start the development servers:

Backend: nodemon index.js (or npm run start if you have a start script)

Frontend: npm run dev

