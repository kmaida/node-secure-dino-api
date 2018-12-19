// Source and modifiable data
const source = require('./data/dinosaurs.json');
let dinosData = [...source];

// Simplified dinosaurs listing
const dinosList = dinosData.map(dino => {
  return {
    name: dino.name,
    pronunciation: dino.pronunciation
  }
});

// Simulate live server call by adding random delay
const delay = () => Math.random() * 2500;

// Authorization
// Accessing secure routes requires access
// token from issuer specified in .env config
const { auth, strategies, requiredScopes } = require('express-oauth2-bearer');
const authCheck = auth(strategies.openid());
// Verify user has appropriate role in custom token claims
const createError = require('http-errors');
const requiredRole = (role) => {
  return (req, res, next) => {
    if (
      req.auth &&
      req.auth.claims &&
      req.auth.claims[process.env.ROLES_CLAIM_NAMESPACE].indexOf(role) > -1
    ) {
      return next();
    } else {
      return next(
        createError(
          401,
          'You do not have sufficient permissions to access this resource.'
        )
      );
    }
  }
};

// Router
const express = require("express");
const router = express.Router();

/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
*/

// GET basic dinosaur listing (public)
router.get('/api/dinosaurs', (req, res) => {
  setTimeout(() => {
    res.json(dinosList);
  }, delay());
});

// GET dinosaur details by name (secure)
// Requires access token; delegated access w/ scope
router.get('/api/secure/dinosaur/:name',
  authCheck,
  requiredScopes('read:dino-details'),
  (req, res) => {
    setTimeout(() => {
      const name = req.params.name;
      const thisDino = dinosData.find(dino => dino.name.toLowerCase() === name);
      res.json(thisDino);
    }, delay());
  }
);

// POST toggles dino as a favorite (secure)
// Requires access token; delegated access w/ scope
// Dinosaur name must be provided in body
router.post('/api/secure/fav',
  authCheck,
  requiredScopes('write:dino-fav'),
  (req, res) => {
    setTimeout(() => {
      const dinoName = req.body.name;
      const matchingDino = dinosData.filter(d => d.name === dinoName)[0];

      if (!matchingDino) {
        res.status(404).send({error: `Cannot find a dinosaur called "${dinoName}"`});
      } else {
        if (matchingDino.hasOwnProperty('favorite')) {
          matchingDino.favorite = !matchingDino.favorite;
        } else {
          matchingDino.favorite = true;
        }
        res.json(matchingDino);
      }
    }, delay());
  }
);

// GET Admin (secure)
// Requires access token; delegated access with scope
// Requires 'admin' user role claim
router.get('/api/secure/admin',
  authCheck,
  requiredScopes('read:admin'),
  requiredRole('admin'),
  (req, res) => {
    setTimeout(() => {
      res.json({ message: 'Congratulations, you are an Admin!' });
    }, delay());
  }
);

module.exports = router;
