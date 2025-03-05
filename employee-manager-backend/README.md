
# Employee Manager Backend

This is the Django backend for the Employee Manager application.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Django
- Django Rest Framework
- PostgreSQL (optional, SQLite is configured by default)

### Environment Setup
1. Navigate to the backend directory:
   ```
   cd employee-manager-backend
   ```

2. Activate the virtual environment:
   - Windows:
   ```
   venv\Scripts\activate
   ```
   - Unix or MacOS:
   ```
   source venv/bin/activate
   ```

3. Install the required packages:
   ```
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   ```

4. Database Setup:
   - By default, SQLite is configured. No additional setup required.
   - To use PostgreSQL (commented in settings.py):
     - Install PostgreSQL and create a database named 'employee_manager_db'
     - Update settings if needed (db name, user, password, etc.)
     - Uncomment the PostgreSQL section in settings.py

5. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create a superuser (admin):
   ```
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```
   python manage.py runserver
   ```

The server will be available at http://localhost:8000/

## API Endpoints

- POST `/api/register/`: Register a new user
- POST `/api/login/`: Login and get JWT token
- POST `/api/logout/`: Logout
- GET `/api/user/`: Get current user data

## Testing the API
- Use the Django admin interface at http://localhost:8000/admin/
- Use tools like Postman or curl to test API endpoints

## Common Issues
- If you have issues with CORS, check the CORS_ALLOWED_ORIGINS in settings.py
- If you can't connect to PostgreSQL, make sure the service is running and credentials are correct
- Make sure the virtual environment is activated before running commands
