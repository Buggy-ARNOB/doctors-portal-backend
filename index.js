const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors());
//To do json of client response
app.use(express.json());



const uri = "mongodb+srv://ruhullah:skeGA0PiFjOrTNSh@ruhullahdb.09lbuxj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        const doctorCollection = client.db("doctorsPortal").collection("doctor")

        const review = client.db("doctorsPortal").collection("review")


        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = review.find(query);
            const reviw = await cursor.toArray();
            res.send(reviw);
        })

        app.get('/doctor', async (req, res) => {
            const query = {};
            const cursor = doctorCollection.find(query);
            const doctors = await cursor.toArray();
            res.send(doctors);
        })



        app.post('/doctor', async (req, res) => {
            const doctor = req.body;
            const result = await doctorCollection.insertOne(doctor)
            res.send(result);
        })



        app.delete('/doctor/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await doctorCollection.deleteOne(query)
            console.log(result);
            res.send(result);
        })


        app.get('/doctor/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const selectedDoctor = await doctorCollection.findOne(query)
            res.send(selectedDoctor);
        })

        app.put('/doctor/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const doctor = req.body;
            const updatedDoctor = {
                $set: {
                    title: doctor.title,
                    img: doctor.img,
                    rating: doctor.rating
                }
            }

            const result = await doctorCollection.updateOne(filter, updatedDoctor, option);
            res.send(result)
        })

    }

    finally {

    }
}




run().catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('API Running');
});

app.listen(port, () => {
    console.log('Server running on port', port);
})