const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://hulevedant_db_user:vhSYxf8HsCIBT8bw@vedantcluster.huqfoir.mongodb.net/restaurantDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let db;

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    db = client.db("restaurantDB");

    app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

startServer();

// ---- Routes ----
// MenuItems
app.get('/menu', async (req, res) => {
  const items = await db.collection('MenuItems').find({}).toArray();
  res.json(items);
});

app.post('/menu', async (req, res) => {
  const result = await db.collection('MenuItems').insertOne(req.body);
  res.json(result);
});

// Customers
app.get('/customers', async (req, res) => {
  const customers = await db.collection('Customers').find({}).toArray();
  res.json(customers);
});

app.post('/customers', async (req, res) => {
  const result = await db.collection('Customers').insertOne(req.body);
  res.json(result);
});

// Orders
app.get('/orders', async (req, res) => {
  const orders = await db.collection('Orders').find({}).toArray();
  res.json(orders);
});

app.post('/orders', async (req, res) => {
  const order = req.body;
  let total = 0;
  for (let it of order.items) {
    const menuItem = await db.collection('MenuItems').findOne({ _id: new ObjectId(it.menuItemId) });
    total += menuItem.price * it.quantity;
  }
  order.totalAmount = total;
  order.status = "Pending";
  order.orderDate = new Date();
  const result = await db.collection('Orders').insertOne(order);
  res.json(result);
});
