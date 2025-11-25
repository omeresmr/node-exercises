const express = require('express');
const path = require('path');
const rootDir = require('./util/path');

const app = express();

// Set /public to static path
app.use(express.static(path.join(rootDir, 'public')));

const rootRoutes = require(path.join(rootDir, 'routes', 'root.js'));
const aboutRoutes = require(path.join(rootDir, 'routes', 'about.js'));
const usersRoutes = require(path.join(rootDir, 'routes', 'users.js'));

// Timestamp Middleware
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${req.time}] ${req.method} ${req.url}`);
  next();
});

app.use(rootRoutes);
app.use(aboutRoutes);
app.use(usersRoutes);

app.listen(3000);
