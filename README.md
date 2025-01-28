# Node.js Backend Project with Docker

## Overview
This is a Node.js (v18) backend project with MySQL and Redis integration, containerized using Docker. The project includes user management features with role-based authentication and authorization.

## Tech Stack
- Node.js v18
- MySQL 8.0
- Redis (Latest)
- Docker & Docker Compose

## Prerequisites
- Docker and Docker Compose installed on your machine
- Node.js v18 (for running commands outside container)
- Git (for cloning the repository)

## Project Setup

### 1. Environment Configuration
Create a `.env` file in the root directory with the following variables:
```env
# Your environment variables here
```

### 2. Starting the Services
Run the following commands to build and start the Docker containers:

```bash
# Build the Docker images
docker compose build

# Start the containers in detached mode
docker compose up -d
```

This will create and start three containers:
- Backend service (Node.js) - Port 3000
- MySQL database - Port 3306
- Redis server - Port 6379

### 3. Database Seeding

After the containers are up and running, execute the following commands to seed the database:

```bash
# Create admin user
npm run seed:admin:user

# (Optional) Create 20 sample users
npm run seed:users
```

## API Documentation

### Authentication
- **Login API**: Available after initial setup
- **Authentication**: JWT token-based
- **Authorization**: Role-based (Admin privileges required for Create, Update, Delete operations)

### Available Endpoints

1. **Status Check**
   - Endpoint: `/status`
   - Description: Check server, database, and Redis connection status
   - Authentication: Not required

2. **User Management**
   - Create User (Admin only)
   - Update User (Admin only)
   - Delete User (Admin only)
   - List Users
   
*Note: Detailed API documentation with endpoints, request/response formats will be provided separately*

## Container Details

### Backend Container
- Container Name: backend
- Port: 3000
- Volume: Maps local directory to `/usr/src/app`
- Dependencies: MySQL and Redis containers

### MySQL Container
- Container Name: mysql
- Port: 3306
- Default Database: user_management
- Volume: Persistent data storage using `mysql_data` volume

### Redis Container
- Container Name: redis
- Port: 6379
- Configuration: Default Redis configuration

## Development

### Accessing Containers
```bash
# Access backend container
docker exec -it backend bash

# Access MySQL container
docker exec -it mysql bash

# Access Redis container
docker exec -it redis bash
```

### Useful Commands
```bash
# View container logs
docker logs backend
docker logs mysql
docker logs redis

# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v
```