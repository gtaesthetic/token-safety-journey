
# Employee Manager Application

This project includes both a frontend (React/TypeScript) and backend (Django) for an employee management system.

## Backend Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Conda (Miniconda or Anaconda)

### Setting up the Django Backend
1. Open a terminal and navigate to the backend directory:
   ```
   cd employee-manager-backend
   ```

2. Create and activate a Conda environment:
   ```
   conda create -n employee-manager-env python=3.12
   conda activate employee-manager-env
   ```

3. Install required packages (if not already installed):
   ```
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   ```

4. Apply migrations:
   ```
   python manage.py makemigrations accounts
   python manage.py migrate
   ```

5. Start the development server:
   ```
   python manage.py runserver
   ```

The backend server will be available at http://localhost:8000/

## Frontend Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Setting up the React Frontend
1. Open a new terminal and navigate to the project root

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   npx vite --port=4000
   ```

The frontend will be available at http://localhost:4000/ or http://localhost:8080/

## Troubleshooting

### Backend issues:
- Make sure the Conda environment is activated before running the server
- Check that all required packages are installed
- Verify database connection details if using PostgreSQL

### Frontend issues:
- Ensure the backend server is running before making API requests
- Check the console for error messages
- Verify that API_URL in src/services/api.ts points to the correct backend URL (http://localhost:8000/api)

## Demo Accounts
- Employee: employee@example.com / password123
- Manager: manager@example.com / password123
