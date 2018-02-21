const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // https://www.npmjs.com/package/cors
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Bear = require('./Bears/BearModel');

const server = express();

server.use(helmet()); // https://helmetjs.github.io/
server.use(cors()); // https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(bodyParser.json());

server.get('/', function(req, res) {
  res.status(200).json({ status: 'API Running' });
});

server.post('/api/bears', function(req, res) {
  const bearInformation = req.body;
  const { species, latinName } = req.body;

  if (species && latinName) {
    const bear = new Bear(bearInformation); // mongoose document
    bear
      .save() // returns a promise
      .then(savedBear => {
        res.status(201).json(savedBear);
      })
      .catch(error => {
        res.status(500).json({
          error: 'There was an error while saving the Bear to the Database'
        });
      });
  } else {
    res.status(500).json({
      errorMessage: 'Please provide both species and latinName for the Bear'
    });
  }
});

server.get('/api/bears', function(req, res) {
  Bear.find({}) // all the bears
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The information could not be retrieved.' });
    });
});

server.get('/api/bears/:id', function(req, res) {
  const id = req.params.id;

  Bear.findById(id) // all the bears
    .then(bear => {
      res.status(200).json(bear);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The information could not be retrieved.' });
    });
});

mongoose
  .connect('mongodb://localhost/BearKeeper') // returns a promise
  .then(db => {
    console.log(
      `Successfully Connected to MongoDB ${db.connections[0].name} database`
    );
  })
  .catch(error => {
    console.error('Database Connection Failed');
  });

const port = process.env.PORT || 5005;
server.listen(port, () => {
  console.log(`API running on http://localhost:${port}.`);
});

// CLient (JS Objects) <JSON> [API (JS OBJECTS) mongoose] <BSON> MongoDB (BSON)]
// mongoose Schema =compiled to => mongoose Model =bridge to documents on the database
