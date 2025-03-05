
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
