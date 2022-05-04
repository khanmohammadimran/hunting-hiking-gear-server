const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

//middlewear
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxuhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const equipmentCollection = client.db('hikingEquipment').collection('equipment');

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