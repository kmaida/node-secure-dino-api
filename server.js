// General Dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createError = require('http-errors');
// Authorization (for endpoint protection / routes)
// Accessing protected routes requires an access token from
// the issuer specified in the .env configuration
const { auth, strategies, requiredScopes } = require('express-oauth2-bearer');
const authCheck = auth(strategies.openid());
const requiredRole = (role) => {
  return (req, res, next) => {
    if (
      req.auth &&
      req.auth.claims &&
      req.auth.claims[process.env.ROLES_CLAIM_NAMESPACE].indexOf(role) > -1
    ) {
      return next();
    } else {
      return next(createError(401, 'You do not have sufficient permissions to access this resource.'));
    }
  }
};

// App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Set port
const port = process.env.PORT || '3005';
app.set('port', port);

// Routes
require('./routes')(app, authCheck, requiredScopes, requiredRole);

// Server
app.listen(port, () => console.log(`Server running on localhost:${port}`));
