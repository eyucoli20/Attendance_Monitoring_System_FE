## Attendance Monitoring or Tracker Frontend React App

This repository contains the frontend codebase for the Attendance Tracking application. The app can be configured to connect to either a local backend server or a deployed server. Additionally, instructions for running the app from local is provided and also can use deployed endpoint


## Prerequisites

- Node.js and npm installed on your system.
- Basic knowledge of React.
- Access to the Attendance Monitoring backend API (local or deployed).

## Configuration Options:
## Backend Configuration:
## Local Server:

- If you want to configure the app to connect to a local backend server, open the constants.js file.
  Update the baseURL constant to "http://localhost:9191".

## Deployed Server:

- If you want to configure the app to connect to a deployed backend server, open the api.js file in services folder then,Update the baseURL to 'https://attendance-system-fwt8.onrender.com/'.

## Doc for endpoints
- 'https://attendance-system-fwt8.onrender.com/swagger-ui/index.html'


## Running the App:
## Local Development:

- Navigate to your project directory in the terminal.
- Run npm install or npm install --legacy-peer-deps
 to install dependencies.
- Start the development server with npm start.
- Access the app at http://localhost:3030.


## Access the App
Once the containers are up and running, you can access the Attendance Management app by opening your web browser and visiting http://localhost:3030.

## For Login use defualt admin 

#For Admin
- userName: john@admin.com
- password: 123456

#For User

 - userName: dani
 - password: 123456

#For Manager
  - userName : manager1
  - password : 123456
