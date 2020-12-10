const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
const port = 5000
app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pi2i0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("ema-jhon-store").collection("products");
  const ordersCollection = client.db("ema-jhon-store").collection("order");
  app.post('/addProducts', (req, res) => {
    const products = req.body;

    productsCollection.insertOne(products)
    .then(result => {
      res.send(result.insertedCount);
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/orders', (req, res) => {
    const orders = req.body;

    ordersCollection.insertOne(orders)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

});


app.listen(process.env.PORT || port)