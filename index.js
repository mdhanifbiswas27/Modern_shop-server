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
    // await client.connect();

    const productsCollection = client.db('productDB').collection('products');
    const shopUserCollection =client.db('productDB').collection('shopUser');
    const cartCollection =client.db('productDB').collection('userCart');
    const customerReviewsCollection = client.db('productDB').collection('customerReviews');

// To get all product at once time
 app.get('/products', async(req, res)=>{
    const cursor = productsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
 })
//  to get all cart item
app.get('/userCart', async(req, res)=>{
  const cursor= cartCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

// get all customer reviews
app.get('/customerReviews', async(req,res)=>{
  const cursor = customerReviewsCollection.find();
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
// update a product
app.put('/products/:id', async(req, res)=>{
  const id = req.params.id;
  const filter ={_id: new ObjectId(id) };
  const options ={ upsert: true};
  const updatedProduct = req.body;
  const product ={
    $set:{
      name :updatedProduct.name ,
      brand:updatedProduct.brand,
        photo:updatedProduct.photo,
        type: updatedProduct.type,
        price:updatedProduct.price, 
        rating:updatedProduct.rating
    }
  }
  const result = await productsCollection.updateOne(filter,product,options);
  res.send(result);
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


//  add a customer review
app.post('/customerReviews', async(req, res)=>{
  const NewReview = req.body;
  const result = await customerReviewsCollection.insertOne(NewReview)
  res.send(result);
})

//  add user
app.post('/shopUser', async(req, res)=>{
   const shopUser = req.body;
    
   const result = await shopUserCollection.insertOne(shopUser);
   res.send(result);
})

// add product to cart
app.post('/userCart', async (req, res)=>{
  const userCart = req.body;

  const result = await cartCollection.insertOne(userCart);
  res.send(result);
})

// delete a cart item
app.delete('/userCart/:id' , async(req, res)=>{
   const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await cartCollection.deleteOne(query);
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
    res.send('assignment server is running ')
})

app.listen(port, ()=>{
    console.log(`assignment server running on port:${port}`)
})

// await client.connect()
// await client.db()