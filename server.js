'use strict';

const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// import database functions
const { getAllEngines } = require('./libraries/databaseFunctions');

const app = express();
app.use(cors());
// fetch post req.body fields as JSON
app.use(express.json());

const PORT = process.env.PORT || 3051;
app.listen(PORT, () => {
  console.log('Express, Mongoose steam engine API listening port: ', PORT);
});

/***
 * Routes
 * 
 */

// localhost:3050/allEngines endpoint
app.get('/allEngines', getAllEngines);
