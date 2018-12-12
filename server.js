// General Dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Auth (for endpoint protection / routes)
const { auth, strategies, requiredScopes } = require('express-oauth2-bearer');
const authCheck = auth(strategies.openid());

// App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Set port
const port = process.env.PORT || '3005';
app.set('port', port);

// Routes
require('./routes')(app, authCheck, requiredScopes);

// Server
app.listen(port, () => console.log(`Server running on localhost:${port}`));
