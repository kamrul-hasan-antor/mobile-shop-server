const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

require("dotenv").config();
// console.log(process.env.DB_USER);
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dcrxy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.DB_COLLECTION}`);
  const productCollectionForOrder = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.DB_COLLECTION}`);

  app.get("/products", (req, res) => {
    productsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    productsCollection.insertOne(newProduct).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //   client.close();////////////
  app.get("/checkout/:_id", (req, res) => {
    productsCollection
      .find({ _id: ObjectId(req.params._id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/addOrders", (req, res) => {
    const newOrders = req.body;
    productCollectionForOrder.insertOne(newOrders).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders", (req, res) => {
    productCollectionForOrder.find().toArray((err, items) => {
      res.send(items);
    });
  });
  app.delete("/delete/:_id", (req, res) => {
    productsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.get("/", (req, res) => {
  res.send("hello !!!");
});

app.listen(port);
