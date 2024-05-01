# Kigali Real Time Ride Tracker

### Introduction 
Kigali Real Time Ride Tracker is an application designed to assist drivers of a transportation agency in Kigali, 
while they are navigating in route Nyabugogo to Kimironko bus stops. 
The application provides real-time information about the bus's location, distance to the next bus stop, and estimated time of arrival to the next bus stop. 
 
 ### Features
 1. Real time location for the bus
 2. Information for the next bus stop 
 3. Distance to next stop
 4. Estimated time of arrival to the next bus stop

### Technology used 
1. Frontend: ReactJs
2. Backend: NodeJs (ExpressJs)
3. Location tracking: Google Map Api service

### Requirements
1. NodeJs
2. Browser
3. Personal Computer or mobile phone that has GPS tracker

### Local Setup 
1. Clone the repository `git clone {url}`
2. Go to download location `cd {folder_name}`
3. Install node packages `npm install`
4. Get Google Map API keys at https://developers.google.com/maps/documentation/javascript/get-api-key
5. Add your API keys in the file `src/config/Keys.js`

### Starting the project
1. On the root of directory nun `node server.js`. This will start the backend at http://localhost:5000 which will be used to request for data from Google Map on behalf of the application.
2. Open another terminal and run `npm run dev`. This will start frontend of application localy.
3. In the browser, open the frontend of application and allow browser to access your location.

### Troubleshoting
1. Make sure you assigned correct API keys in the file `src/config/Keys.js` to the variable 'GOOGLE_MAP_KEYS'.
2. Make sure you opened the backend and is accessible at http://localhost:5000 otherwise change backend address in Keys.js file.
3. Make sure you allowed both of browser and local application to access your location. 


### Screenshoots

![Screenshot](./public/img1.png)
![Screenshot](./public/img2.png)



    
 
