
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

if (!uri) throw new Error('Please add your Mongo uri to .env')

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
let clientPromise

if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export default clientPromise