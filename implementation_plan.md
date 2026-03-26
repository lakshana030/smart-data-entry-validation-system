# Smart Data Entry Validation System - Fix Plan

## Goal Description
Review, debug, and correct the project to make it fully functional and production-ready. We will fix the frontend token handling, reorganize the backend into proper MVC structure (routes, controllers, models), and configure the root [package.json](file:///c:/Users/HP/Desktop/smart-data-entry-validation-system/package.json) to correctly start the project with `npm run dev`.

## Proposed Changes

### 1. Project Organization & Root Configuration
- Create a single root [package.json](file:///c:/Users/HP/Desktop/smart-data-entry-validation-system/package.json) that installs both backend and frontend dependencies using `concurrently`.
- Modify `npm run dev` to start both the backend Node server and a static file server for the frontend (or let Express serve the frontend files statically). 
- We will configure Express in [backend/server.js](file:///c:/Users/HP/Desktop/smart-data-entry-validation-system/backend/server.js) to serve the `frontend` folder as static files, which simplifies the project to a single server running on port 5000.

### 2. Backend Architecture Refactoring
Move business logic out of [server.js](file:///c:/Users/HP/Desktop/smart-data-entry-validation-system/backend/server.js) into appropriate folders:
- **`backend/routes/userRoutes.js`**: Define API routes for users.
- **`backend/controllers/userController.js`**: Hold the request handling logic (register, login, get users, update, delete).
- **[backend/config/db.js](file:///c:/Users/HP/Desktop/smart-data-entry-validation-system/backend/config/db.js)**: Fix PostgreSQL configuration (remove forced SSL for local environment to prevent connection errors).
 *Also, auto-create the `data_entries` table on startup if it doesn't exist to ensure smooth execution.*

### 3. Backend Bug Fixes & Improvements
- **Registration**: Update the `/api/register` endpoint to return a JWT token upon successful registration, just like login. This allows the user to immediately perform authorized actions (Update/Delete) after registering.
- Ensure all endpoints use robust try-catch error handling.
- Verify `JWT_SECRET` and [.env](file:///c:/Users/HP/Desktop/smart-data-entry-validation-system/backend/.env) parsing.

### 4. Frontend Fixes ([validation.js](file:///c:/Users/HP/Desktop/smart-data-entry-validation-system/frontend/js/validation.js))
- Save the JWT token returned from registration to `localStorage` so that subsequent API calls (Update/Delete) succeed.
- Clear `successMessage` logic correctly.
- Fix UI so the user list updates dynamically and API URL points to the correct static endpoint (which will now be relative `/api/...` since frontend and backend will share the same origin).

## Verification Plan
1. Run `npm install` at the root to set up everything.
2. Run `npm run dev` to start the server.
3. Open the browser and test registering a user, updating user data, and deleting a user.
4. Verify all actions reflect in the PostgreSQL database correctly.
