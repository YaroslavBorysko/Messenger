# Messenger application with React, Django and WebSocket

## Running the Project using Docker Compose

The project is deployed using Docker Compose. To run it, follow these steps:

1. Make sure you have Docker and Docker Compose installed.

2. Create a `.env` file in the project root and specify the required environment variables:

   ```dotenv
   DOCKER_DATABASE_URL=
   DOCKER_POSTGRES_DB=
   DOCKER_POSTGRES_USER=
   DOCKER_POSTGRES_PASSWORD=
   DOCKER_REACT_APP_API_URL=
   DOCKER_REACT_APP_SOCKET_URL=
   
## Start the project with the following command:

   ```bash
   docker-compose up --build
   ```

### After a successful launch, your application will be available at http://localhost.

## Creating a Superuser

To create a Django superuser, use the following command:

```bash
python manage.py createsuperuser
```
Follow the instructions to enter the username, email, and password.

# Additional Information

## To update Python dependencies, run:
```bash
pip install -r requirements.txt
```

## To migrate the database, run:

```bash
python manage.py migrate
```
Adjust Nginx configuration in the nginx folder according to your needs.


# We hope you find it helpful!