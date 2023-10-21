const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwbcngj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
// To get all product at once time
    const productsCollection = client.db('productDB').collection('products');
 app.get('/products', async(req, res)=>{
    const cursor = productsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
 })
//  get product on id
app.get('/products/:id',async(req, res)=>{
  const id =req.params.id
  
  const query = {_id: new ObjectId(id)}
  const product = await productsCollection.findOne(query);
  res.send(product);
})

// to get specific products basis on brand
 app.get('/products/:brand',async(req, res)=>{
    const brand =req.params.brand;
    
    const query = {brand:brand}
    const product = await productsCollection.findOne(query);
    res.send(product);
 })

// to add new product
 app.post('/products', async(req, res)=>{
     const newProduct =req.body;
     console.log(newProduct);
     const result = await productsCollection.insertOne(newProduct);
     res.send(result);
 })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


// -------------------------------------------------
app.get('/',(req, res)=>{
    res.send('coffee making server is running ')
})

app.listen(port, ()=>{
    console.log(`coffee server is running on port:${port}`)
})