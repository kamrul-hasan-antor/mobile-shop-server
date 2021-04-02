const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world!!!!!!!!!!!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dcrxy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
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
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  //   client.close();////////////
  app.get("/checkout/:_id", (req, res) => {
    console.log(req.params._id);
    productCollection
      .find({ _id: ObjectId(req.params._id) })

      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/addOrders", (req, res) => {
    const newOrder = req.body;
    productCollectionForOrder.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders", (req, res) => {
    productCollectionForOrder.find().toArray((err, items) => {
      res.send(items);
    });
  });
  app.delete("/delete/:_id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
