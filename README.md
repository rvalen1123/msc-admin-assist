## Running the Project with Docker

To run this project using Docker, follow the steps below:

### Prerequisites

- Ensure Docker and Docker Compose are installed on your system.
- Verify that the required environment variables are set:
  - `NODE_ENV`: Set to `production` for production builds.
  - `DATABASE_URL`: Connection string for the PostgreSQL database.
  - `JWT_SECRET`: Secret key for JWT authentication.

### Build and Run Instructions

1. Build and start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```
2. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:3000](http://localhost:3000)

### Exposed Ports

- Frontend: `3000`
- Backend: `3000`

### Notes

- Ensure the `docker-compose.yml` file is correctly configured with the necessary environment variables and volume mappings.
- For database persistence, the `db_data` volume is used to store PostgreSQL data.

Refer to the `docker-compose.yml` file for additional configuration details.