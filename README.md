# Maintenance Manager

Maintenance Manager is a full stack web application for tracking vehicles and their maintenance history.

Users can securely log in, manage their own vehicles, and create, update, and delete maintenance records such as oil changes, repairs, mileage, service dates, costs, and notes.

The application is built with React and Django REST Framework, uses PostgreSQL for persistent data storage, and is containerized with Docker. Automated backend tests run through GitHub Actions on every push to help ensure changes do not break existing functionality.

## Features

- User authentication with secure token based login
- Users can only access their own vehicles and maintenance records
- Create, view, update, and delete vehicles
- Create, view, update, and delete maintenance records
- Track service type, date, mileage, cost, and notes
- PostgreSQL database for persistent storage
- Dockerized frontend, backend, and database
- Automated backend testing with Pytest
- Continuous Integration with GitHub Actions

## Tech Stack

### Frontend

- React
- JavaScript
- Vite
- HTML
- CSS

### Backend

- Python
- Django
- Django REST Framework
- Token Authentication

### Database

- PostgreSQL

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- Pytest

## Architecture

```text
React Frontend
      |
      | HTTP / JSON
      v
Django REST API
      |
      | Django ORM
      v
PostgreSQL Database
```

The frontend sends authenticated API requests to the Django backend. Django handles authentication, business logic, validation, and database access. PostgreSQL stores user, vehicle, and maintenance data persistently.

Docker Compose runs the frontend, backend, and database as separate containers that communicate over a shared Docker network.

## Running the Project with Docker

Make sure Docker Desktop is installed and running.

From the project root, build and start the application:

```bash
docker compose up -d --build
```

The application will be available at:

```text
Frontend: http://127.0.0.1:5173
Backend:  http://127.0.0.1:8000
```

To stop the containers:

```bash
docker compose down
```

PostgreSQL data is stored in a Docker volume, so application data remains available when containers are stopped and recreated.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/login/` | Log in and receive an authentication token |

### Vehicles

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/vehicles/` | Get all vehicles belonging to the logged in user |
| POST | `/vehicles/` | Create a new vehicle |
| GET | `/vehicles/<id>/` | Get a specific vehicle |
| PUT | `/vehicles/<id>/` | Update a vehicle |
| DELETE | `/vehicles/<id>/` | Delete a vehicle |

### Maintenance Records

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/maintenance/` | Get the logged in user's maintenance records |
| POST | `/maintenance/` | Create a maintenance record |
| GET | `/maintenance/<id>/` | Get a specific maintenance record |
| PUT | `/maintenance/<id>/` | Update a maintenance record |
| DELETE | `/maintenance/<id>/` | Delete a maintenance record |

Protected API endpoints require authentication.

## Testing and Continuous Integration

Backend tests are written with Pytest and pytest-django.

To run the tests inside the backend Docker container:

```bash
docker compose exec backend pytest
```

The current automated test suite contains 10 tests covering:

- Vehicle model behavior
- Vehicle API operations
- Maintenance API operations
- Authentication requirements
- User data isolation
- Protection against accessing another user's data

The test suite currently passes:

```text
10 passed
```

GitHub Actions automatically runs the backend test suite whenever code is pushed or a pull request is created.

```text
Code Change
    |
    v
Git Push / Pull Request
    |
    v
GitHub Actions
    |
    v
PostgreSQL Test Database
    |
    v
Pytest
    |
    v
Pass or Fail
```

This provides continuous integration by automatically checking that backend changes do not break existing functionality.

## Project Structure

```text
maintenance_manager/
│
├── backend/
│   ├── config/              # Django project configuration
│   ├── vehicles/            # Vehicle model, API, and tests
│   ├── maintenance/         # Maintenance model, API, and tests
│   ├── manage.py
│   ├── requirements.txt
│   ├── pytest.ini
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React application components
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── backend-tests.yml
│
├── compose.yaml
└── README.md
```

The project is separated into independent frontend and backend applications. Docker Compose connects the React frontend, Django API, and PostgreSQL database during development.

## Environment Configuration

The React frontend uses a Vite environment variable to configure the backend API URL.

Create a `.env` file inside the `frontend` directory:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

The `.env` file is excluded from Git and should not be committed to the repository.

React accesses the value with:

```javascript
const API_URL = import.meta.env.VITE_API_URL
```

This allows the backend URL to be changed for different environments without modifying the application source code.

## Security

The application implements several protections to keep user data separated.

- API endpoints require authentication
- Authentication tokens are required for protected requests
- Vehicle queries are filtered by the authenticated user
- Maintenance records are restricted to vehicles owned by the authenticated user
- Users cannot create maintenance records for another user's vehicle
- Backend tests verify user data isolation

## Current Architecture

```text
Browser
   |
   v
React + Vite
   |
   | REST API requests
   | Authorization Token
   v
Django REST Framework
   |
   | Authentication
   | Validation
   | Business Logic
   v
Django ORM
   |
   v
PostgreSQL
```

During development, the application services are managed with Docker Compose:

```text
Docker Compose
   |
   +-- Frontend Container
   |      React + Vite
   |
   +-- Backend Container
   |      Django REST Framework
   |
   +-- Database Container
          PostgreSQL
```

## CI Pipeline

The repository uses GitHub Actions for continuous integration.

Whenever changes are pushed to GitHub, the CI workflow:

1. Checks out the repository
2. Sets up Python
3. Installs backend dependencies
4. Starts a PostgreSQL test database
5. Runs the Pytest test suite
6. Reports whether the build passed or failed

This helps catch backend problems before changes are deployed.

## Future Improvements

Planned improvements include:

- Improve the frontend user interface
- Add loading indicators and additional error handling
- Add frontend automated tests
- Add an `.env.example` configuration template
- Add production deployment
- Add Continuous Deployment
- Explore Kubernetes deployment
- Add application logging and monitoring

## Project Status

The core full stack application is functional.

Current functionality includes React, Django REST Framework, PostgreSQL, authentication, user data isolation, vehicle CRUD, maintenance CRUD, Docker Compose, automated backend tests, and GitHub Actions continuous integration.

Development is ongoing with a focus on improving the application toward a production ready deployment.