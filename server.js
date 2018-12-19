// General Dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// App
const routes = require('./routes');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/', routes);

// Server
const port = process.env.PORT || '3005';
app.listen(port, () => console.log(`Server running on localhost:${port}`));
