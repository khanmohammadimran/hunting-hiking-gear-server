const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;




//middlewear
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxuhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const equipmentCollection = client.db('hikingEquipment').collection('equipment');
        const myitemCollection = client.db('hikingEquipment').collection('myitem');


        //AUTH
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })


        // Equipment API 

        app.get('/equipment', async (req, res) => {
            const query = {};
            const cursor = equipmentCollection.find(query)
            const equipments = await cursor.toArray();
            res.send(equipments);
        })

        app.get('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const equipment = await equipmentCollection.findOne(query);
            res.send(equipment);
        })

        // Quantity update
        app.patch('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            const newQuantity = req.body;
            console.log(newQuantity)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: newQuantity.quantity
                }
            };
            const result = await equipmentCollection.updateOne(filter, updatedDoc, options);

            res.send(result);

        })

        // Delete a Equipment Service
        app.delete('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await equipmentCollection.deleteOne(query);
            res.send(result);
        })

        // Add a Equipment Service
        app.post('/equipment', async (req, res) => {
            const newEquipment = req.body;
            const result = await equipmentCollection.insertOne(newEquipment);
            res.send(result);
        })


        // MY Item API 

        // User Selected Equipment Collection
        app.get('/myitem', async (req, res) => {
            const email = req.query.email
            const query = { email: email };
            const cursor = myitemCollection.find(query);
            const myitems = await cursor.toArray();
            res.send(myitems)
        })

        app.post('/myitem', async (req, res) => {
            const myitem = req.body;
            const result = await myitemCollection.insertOne(myitem);
            res.send(result);
        })

    }
    finally {

    }


}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Hiking Equipment')
});

app.listen(port, () => {
    console.log('Listening to port', port)
})