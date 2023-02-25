'use strict';

const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// import database functions
const { getAllEngines, addEngine, updateEngine, deleteEngine } = require('./libraries/databaseFunctions');
// import custom validation middleware
const { checkEngineData } = require('./middlewares/checkEngineData');
// not found handler
const notFound = require('./handlers/notFound');

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
// localhost:3050/addEngine POST create endpoint
// checkEngineData is the validator, but one of the validations is incorrect
app.post('/addEngine', addEngine);
// localhost:3050/updateEngine PUT update endpoint
app.put('/updateEngine/:engineId', updateEngine);
// localhost:3050/deleteEngine DELETE endpoint
app.delete('/deleteEngine/:engineId', deleteEngine);

// a misstyped path.
app.get('*', notFound);