# Role-Based Auth VR

## Overview

Role-Based Auth VR is a React.js/Node.js application that provides secure authentication with role-based access control. It supports features like user registration, login, and role-based access to different functionalities such as admin, manager, and user.


## Features

### Authentication
- User registration with validation.
- Secure login with email and password.
- Role-based access control (Admin, User, Manager).

### User Management
- Add, edit, and delete users.
- Restrict actions based on user roles.

### UI/UX
- Dynamic dialog boxes for user creation.
- Validation feedback and styled alerts.
- Smooth navigation between pages.

## Technologies Used

### Frontend
- React.js
- Tailwind CSS for styling
- Ant Design components 

### Backend
- Nodejs & MongoDB for authentication and data storage

### Libraries
- `react-router-dom` for routing
- `react-toastify` and `antd` for notifications



## Setup

### Prerequisites
- Node.js installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/role-based-auth-vr.git
   cd role-based-auth-vr

2. Install dependencies & run:

```bash
cd client
npm install
npm run dev

```bash
cd server
npm install
nodemon index.js