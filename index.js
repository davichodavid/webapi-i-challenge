// implement your API here
const express = require('express');

const database = require('./data/db');

const server = express();

server.use(express.json());


server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.get('/now', (req, res) => {
  const now = new Date().toISOString();
  res.send(now);
})

server.get('/api/users', (req, res) => {
  database.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

server.post('/api/users', (req, res) => {
  const userInfo = req.body;

  database.insert(userInfo)
    .then(user => {
      res.status(201).json({ success: true, user });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  database.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the user you are looking for',
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  database.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({
          success: true,
          updated
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the hub you are looking for'
        });
      };
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

server.listen(4000, () => {
  console.log('\n*** Server is Running on http://localhost:4000 ***\n');
});