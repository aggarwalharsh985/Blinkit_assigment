# Blinkit Backend - Role-Based Access Control API

A full Express.js backend app that uses role-based access control (RBAC) and includes JWT login, audit logging, and MongoDB integration.

## Features

- **User Authentication** (Registration & Login)
- **Role-Based Access Control** (Admin, Manager, User)
- **JWT Token Authentication**
- **Comprehensive Audit Logging**
- **Protected Routes**
- **MongoDB Integration**
- **Client Information Tracking** (IP, User Agent)
- **Log Statistics & Analytics**

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs
- **Logging:** Winston
- **Validation:** Validator.js
- **Environment Management:** dotenv

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Database Configuration
CONNECTION_STRING=mongodb://localhost:27017/blinkit_db
# or for MongoDB Atlas:
# CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/blinkit_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=7001
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blinkit-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env file with your configuration
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or start MongoDB service
sudo systemctl start mongod
```

### 5. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:7001`

## Running Tests

### Manual Testing with Postman

1. Import the Postman collection: `Blinkit_Backend_Collection.postman_collection.json`
2. Set up environment variables in Postman:
   - `Base_URL`: `http://localhost:7001/api`
3. Run the test scenarios in the following order:
   - User Registration
   - User Login
   - Protected Route Access
   - Role-based Access Testing

### Test User Accounts

Use these sample accounts for testing:

```json
// Admin User
{
  "email": "admin@gmail.com",
  "password": "admin123",
  "role": "admin"
}

// Manager User
{
  "email": "manager@gmail.com",
  "password": "manager123",
  "role": "manager"
}

// Regular User
{
  "email": "user@gmail.com",
  "password": "user123",
  "role": "user"
}
```

## API Usage Guide

### Base URL
```
http://localhost:7001/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### 2. Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Welcome user@example.com",
  "user": {...},
  "success": "true"
}
```

### Protected Endpoints

**Note:** All protected routes require Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### 1. User Dashboard (All Roles)
```http
GET /users/user
Authorization: Bearer <token>
```

#### 2. Manager Dashboard (Admin, Manager)
```http
GET /users/manager
Authorization: Bearer <token>
```

#### 3. Admin Dashboard (Admin Only)
```http
GET /users/admin
Authorization: Bearer <token>
```

### Audit Log Endpoints (Admin Only)

#### 1. View Audit Logs
```http
GET /logs/audit?page=1&limit=50&action=LOGIN_ATTEMPT
Authorization: Bearer <admin_token>
```

#### 2. Get Log Statistics
```http
GET /logs/stats
Authorization: Bearer <admin_token>
```

## Role-Based Access Control

### Role Hierarchy
- **Admin**: Full access to all endpoints including audit logs
- **Manager**: Access to user and manager endpoints
- **User**: Access to user endpoints only

### Access Matrix

| Endpoint | User | Manager | Admin |
|----------|------|---------|-------|
| `/users/user` | ✅ | ✅ | ✅ |
| `/users/manager` | ❌ | ✅ | ✅ |
| `/users/admin` | ❌ | ❌ | ✅ |
| `/logs/audit` | ❌ | ❌ | ✅ |
| `/logs/stats` | ❌ | ❌ | ✅ |

## 📊 Audit Logging

The application automatically logs the following events:

- **User Registration**
- **Login Attempts** (successful/failed)
- **Token Verification** (successful/failed)
- **Role Authorization** (access granted/denied)
- **Admin Actions** (dashboard access, log viewing)

### Log Structure
```json
{
  "timestamp": "2025-08-29T06:43:39.000Z",
  "level": "info",
  "message": "LOGIN_ATTEMPT",
  "action": "LOGIN_ATTEMPT",
  "email": "user@example.com",
  "success": true,
  "ip": "127.0.0.1",
  "userAgent": "PostmanRuntime/7.32.3",
  "details": "Login successful"
}
```

## Project Structure

```
src/
├── config/
│   ├── dbConnect.js          # Database connection
│   └── loggerConfig.js       # Winston logging configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── logController.js      # Audit log management
├── middlewares/
│   ├── authMiddleware.js     # JWT token verification
│   ├── roleMiddleware.js     # Role-based authorization
│   └── auditMiddleware.js    # Client info extraction
├── models/
│   └── userModel.js          # User schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── userRoutes.js         # Protected user routes
│   └── logRoutes.js          # Audit log routes
├── services/
│   └── auditService.js       # Audit logging service
└── logs/                     # Log files directory
```

## Configuration

### Database Configuration
The application uses MongoDB with Mongoose. Configure your connection string in the `.env` file:

```javascript
// Local MongoDB
CONNECTION_STRING=mongodb://localhost:27017/blinkit_db

// MongoDB Atlas
CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/blinkit_db
```

### JWT Configuration
Configure JWT secret and expiration:

```javascript
JWT_SECRET=your_super_secret_jwt_key_here
// Token expires in 1 hour (configured in authController.js)
```

## Error Handling

The program has extensive error-handling capabilities for:

- **Validation Errors**: Invalid email format, missing fields
- **Authentication Errors**: Invalid credentials, expired tokens
- **Authorization Errors**: Insufficient permissions
- **Database Errors**: Connection issues, duplicate entries
- **Server Errors**: Internal server errors with appropriate logging

## Sample Data

### User Registration Samples
```json
// Admin
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}

// Manager  
{
  "email": "manager@example.com",
  "password": "manager123",
  "role": "manager"
}

// User
{
  "email": "user@example.com",
  "password": "user123",
  "role": "user"
}
```

## Health Check

The application provides a health check endpoint:

```http
GET /health
```

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2025-08-29T12:00:00.000Z"
}
```

## Security Features

- **Password Hashing**: Using bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Granular access control
- **Input Validation**: Email validation and sanitization
- **Audit Logging**: Comprehensive security event tracking
- **IP Tracking**: Client IP and User Agent logging

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Error: MongoServerError: Connection refused
   ```
   - Ensure MongoDB is running
   - Check CONNECTION_STRING in .env file

2. **JWT Token Invalid**
   ```
   {"message": "Token is not valid"}
   ```
   - Check if token is properly formatted
   - Verify JWT_SECRET matches

3. **Access Denied**
   ```
   {"message": "Access denied"}
   ```
   - Verify user role has required permissions
   - Check if token belongs to correct user role



## Thanks
Harsh Aggarwal