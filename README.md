# Employee Biodata CRUD

A comprehensive employee biodata management system that allows organizations to manage employee profiles, educational backgrounds, work experiences, training records, and skills. This full-stack application provides a complete CRUD (Create, Read, Update, Delete) interface for managing employee data with role-based access control.

This project was developed as part of the Hacktiv8 bootcamp to demonstrate proficiency in building full-stack web applications using React.js for the frontend and Node.js with Express for the backend, integrated with PostgreSQL database using Sequelize ORM.

## Features

- **User Authentication**: Secure registration and login system with JWT-based authentication
- **Role-Based Access Control**: Different permissions for admin and regular users
- **Employee Profile Management**: Complete CRUD operations for employee biodata
- **Educational Records**: Manage educational background information
- **Work Experience**: Track employment history and career progression
- **Training Records**: Maintain training and certification records
- **Skills Management**: Document technical and soft skills
- **Responsive Design**: Mobile-friendly interface built with React

## Listed Pages

- **Register Page**: User registration form to create a new account
- **Login Page**: User authentication form to access the application
- **Profiles Page**: Display list of all employee profiles (admin view)
- **Profile Detail Page**: View detailed information about a specific employee
- **Create Biodata Page**: Form to create new employee biodata
- **Update Biodata Page**: Form to edit existing employee information

## Tech Stack

### Frontend

- **React.js** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing for single-page application
- **Redux Toolkit** - State management for complex application state
- **Axios** - HTTP client for API communication
- **SweetAlert2** - Beautiful, responsive, customizable alerts
- **React Redux** - Official React bindings for Redux

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework for Node.js
- **PostgreSQL** - Robust relational database
- **Sequelize** - Promise-based ORM for PostgreSQL
- **JWT (jsonwebtoken)** - Authentication and authorization
- **bcryptjs** - Password hashing and validation
- **CORS** - Cross-Origin Resource Sharing middleware

### Development Tools

- **ESLint** - Code linting and formatting
- **Jest** - Testing framework
- **Supertest** - HTTP testing library
- **Sequelize CLI** - Database migrations and seeders

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_biodata
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000
```

### Required Dependencies

| Component      | Technology   | Purpose                |
| -------------- | ------------ | ---------------------- |
| Database       | PostgreSQL   | Data persistence       |
| ORM            | Sequelize    | Database operations    |
| Authentication | JWT + bcrypt | Secure user management |

## Project Structure

```
employee-biodata-crud/
├── client/
│   └── employee-bio/
│       ├── public/                  # Static assets
│       ├── src/
│       │   ├── assets/              # Images and static files
│       │   ├── layouts/             # Layout components
│       │   │   └── MainLayout.jsx   # Main application layout
│       │   ├── pages/               # Page components
│       │   │   ├── CreateBiodata.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── ProfileId.jsx
│       │   │   ├── Profiles.jsx
│       │   │   ├── Register.jsx
│       │   │   └── UpdateBiodata.jsx
│       │   ├── utils/               # Utility functions
│       │   │   ├── apiClient.js     # API configuration
│       │   │   ├── cookieHelper.js  # Cookie management
│       │   │   └── debugHelper.js   # Debugging utilities
│       │   ├── App.jsx              # Root component
│       │   └── main.jsx             # Application entry point
│       ├── package.json
│       └── vite.config.js
├── server/
│   ├── bin/
│   │   └── www                      # Server startup script
│   ├── config/
│   │   └── config.json              # Database configuration
│   ├── controllers/                 # Request handlers
│   │   ├── profileController.js     # Profile-related operations
│   │   └── userController.js        # User authentication
│   ├── helpers/                     # Utility functions
│   │   ├── bcrypt.js               # Password hashing
│   │   └── jwt.js                  # JWT token management
│   ├── middlewares/                # Express middlewares
│   │   ├── authentication.js       # JWT authentication
│   │   ├── authorization.js        # Role-based authorization
│   │   └── errorHandler.js         # Error handling
│   ├── migrations/                 # Database migrations
│   ├── models/                     # Sequelize models
│   │   ├── biodata.js
│   │   ├── education.js
│   │   ├── skill.js
│   │   ├── training.js
│   │   ├── user.js
│   │   └── workexperience.js
│   ├── routes/                     # API routes
│   │   ├── index.js               # Main routes
│   │   └── profile.js             # Profile routes
│   ├── seeders/                   # Database seeders
│   ├── app.js                     # Express application
│   └── package.json
└── README.md                      # Project documentation
```

## API Endpoints

### Authentication

- `POST /register` - Register new user account
- `POST /login` - User login with email and password
- `GET /` - Get current user profile (authenticated)

### Profile Management

- `GET /profiles` - Get all users (admin only)
- `POST /profiles` - Create new biodata (authenticated)
- `GET /profiles/:id` - Get user by ID (owner and admin only)
- `PUT /profiles/:id` - Update biodata (owner and admin only)
- `DELETE /profiles/:id` - Delete user profile (owner only)

## Database Schema

### Core Tables

- **Users** - User accounts and authentication
- **Biodata** - Personal information and profile data
- **Education** - Educational background records
- **Work Experience** - Employment history
- **Training** - Training and certification records
- **Skills** - Technical and soft skills

### Relationships

- User `hasOne` Biodata
- Biodata `hasMany` Education, WorkExperience, Training, Skills

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure database:

   ```bash
   # Create database
   createdb employee_biodata

   # Run migrations
   npx sequelize-cli db:migrate

   # (Optional) Run seeders
   npx sequelize-cli db:seed:all
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client/employee-bio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Usage

1. **Registration**: Create a new account using the registration form
2. **Login**: Authenticate with your credentials to access the system
3. **Create Profile**: Fill out the biodata form with personal information
4. **View Profiles**: Browse through employee profiles (admin feature)
5. **Update Information**: Edit and update existing biodata
6. **Manage Records**: Add, edit, or remove education, work experience, training, and skills

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.
