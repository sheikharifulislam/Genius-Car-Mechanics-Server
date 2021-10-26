const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jrudo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db("Genius-Car-Machanics");
        const servicesCollection = database.collection("Services");

        //GET Api

        app.get('/all-services', async (req, res) => {
            const allServices = await servicesCollection.find({}).toArray();
            res.json(allServices);
            
        })

        app.get('/services/single-service/:serviceId', async (req, res) => {
            const {serviceId} = req.params;
            const singleService = await servicesCollection.findOne({_id: objectId(serviceId)});           
            res.status(200).json(singleService);
        })

        //POEST Api

        app.post('/add-service', async (req, res) => {
           const service = req.body;
           const result = await servicesCollection.insertOne(service);
           res.json(result);
        })

        //DELETE API

        app.delete('/services/delete-service/:serviceId', async (req, res) => {
            const {serviceId} = req.params;
            const result = await servicesCollection.deleteOne({_id: objectId(serviceId)});
            res.status(200).json(result);
        })
    }
    catch(error) {
        console.log(error.message);
    }
    finally {
        // await client.close();
    }
}

run();



app.get('/',(req,res) => {
    res.send('<h1>Well Come</h1>')
})



const port = process.env.PORT || 5000; 
app.listen(port, () => {
    console.log(`server is running at port ${port}`)
});