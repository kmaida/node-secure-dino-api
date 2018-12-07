// Dependencies
const { auth, strategies, requiredScopes } = require('express-oauth2-bearer');

// Authentication
const authCheck = auth(strategies.openid());

// Data
const source = require('./data/dinosaurs.json');
let dinosData = [...source];

// Data
const dinosList = dinosData.map(dino => {
  return {
    name: dino.name,
    pronunciation: dino.pronunciation
  }
});
// Simulate live server call by adding random delay
const delay = () => Math.random() * 2500;

/*
 |--------------------------------------
 | Routing
 |--------------------------------------
 */

module.exports = function(app) {
  // API works (public)
  app.get('/api', (req, res) => {
    res.send('Dinosaurs API works!');
  });

  // GET basic dinosaur listing (public)
  app.get('/api/dinosaurs', (req, res) => {
    setTimeout(() => {
      res.json(dinosList);
    }, delay());
  });

  // GET dinosaur details by name
  // Requires login; delegated access w/ scope
  app.get('/api/dinosaur/:name',
    authCheck,
    requiredScopes('dino-details:read'),
    (req, res) => {
      setTimeout(() => {
        const name = req.params.name;
        const thisDino = dinosData.find(dino => dino.name.toLowerCase() === name);
        res.json(thisDino);
      }, delay());
    }
  );

  // POST toggles dino as a favorite
  // Requires login; delegated access w/ scope
  // Dinosaur name must be provided in body
  app.post('/api/fav',
    authCheck,
    requiredScopes('dino-fav:write'),
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
};
