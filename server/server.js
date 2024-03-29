const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');


// setting up env

require('dotenv').config();
let { PORT, BACKEND_URL } = process.env;

PORT = process.env.PORT || 8081;

// Ensure Express server is set up to serve React app's static files in production (Heroku Deployment)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build'));
  });
}


if (process.env.NODE_ENV === 'development') {
  app.use(cors());
} else {
  app.use(cors({ origin: process.env.CORS_ORIGIN }));
}

app.use(express.json()); // allows server to handle JSON data sent in req body

// allows browser pre-flight check for JSON requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-Width');
  res.send(200);
})


const shelterRoutes = require('./routes/shelters'); // Routes
app.use('/shelters', shelterRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the SafeHavenTO Server!');
});

app.get('/api/maps-key', (req, res) => {
  res.json({key: process.env.REACT_APP_MAPBOX});
});

// Catch-all route for testing
app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

app.use((req, res) => {
  res.send('This is not a valid route. Try <b>/shelters</b> instead.');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});