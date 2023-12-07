const express = require('express')
const cors = require("cors");
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = 3000

app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER,process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyduvtf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //card
    const vehicleCollection = client.db("rental-service").collection("vehicles");
    const teamCollection = client .db("rental-service").collection("team");
    app.post('/add-a-vehicle',async(req, res) =>{
      const vehicle = req.body;
      const result = await vehicleCollection.insertOne(vehicle)
      res.send(result)
    })
    //Api for fetching all vehicles
    app.get("/all-vehicles", async(req,res) =>{
    const result =  await vehicleCollection.find().toArray();
    res.send(result);
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //Api for fetching single vehicle details

    app.get("/vehicle/:id",async(req,res)=>{
     const id= req.params.id;
     console.log(id); 
     //Find a vehicle using the id passed as param
     const result = await vehicleCollection.findOne({_id: new ObjectId(id)})
      res.send(result)
    })

    //Api for updating a single vehicle
    app.put("/update-by-id/:id",async(req,res)=>{
     const id = req.params.id;
     const filter = {_id: new ObjectId(id)};
     const updatedvehicle =req.body;
    // console.log(updatedvehicle)
     const updates = {$set:updatedvehicle}
     //now call the update 1 method for updating
     const result =await vehicleCollection.updateOne(filter, updates);
      res.send(result)
    })
    //Api for deleting a single vehicle
    app.delete("/delete-by-id/:id", async(req,res)=>{
      const id = req.params.id;
     const filter = {_id: new ObjectId(id)};
      //now call the update 1 method for deleting

      const result = await vehicleCollection.deleteOne(filter);
      res.send(result);
    })

    //post a single teammate
    app.post("/add-teammate",async(req,res) =>{
      const teammate = req.body;
      const result =await teamCollection.insertOne(teammate)
      res.send(result);
    })
  } finally {
    
    
  }
}
run().catch(console.dir);
app.get('/', (req, res)=> {
  res.send('Hello mongo server running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})