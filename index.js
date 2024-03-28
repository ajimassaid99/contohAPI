const express = require('express');
const app = express();
const port = 3000;
const items = require('./data'); 

app.use(express.json());

app.get('/items', (req, res) => {
  res.json(items);
});

app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item tidak ditemukan.');
    res.json(item);
  });

app.post('/items', (req, res) => {
  const newItem = {
    id: items[items.length-1].id+1,
    name: req.body.name
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('Item tidak ditemukan.');
  item.name = req.body.name;
  res.json(item);
});

app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index < 0) return res.status(404).send('Item tidak ditemukan.');
  const deletedItem = items.splice(index, 1);
  res.json(deletedItem);
});


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const hardcodedToken = "rahasia";
  
    if (token == null) return res.sendStatus(401); 
    if (token !== hardcodedToken) return res.sendStatus(403);
  
    next();
  };

  app.get('/auth/items', authenticateToken, (req, res) => {
    res.json(items);
  });
  
  app.post('/auth/items', authenticateToken, (req, res) => {
    const newItem = {
      id: items.length + 1,
      name: req.body.name
    };
    items.push(newItem);
    res.status(201).json(newItem);
  });
  
  app.put('/auth/items/:id', authenticateToken, (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item tidak ditemukan.');
    item.name = req.body.name;
    res.json(item);
  });
  
  app.delete('/auth/items/:id', authenticateToken, (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index < 0) return res.status(404).send('Item tidak ditemukan.');
    const deletedItem = items.splice(index, 1);
    res.json(deletedItem);
  });


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
