const { MongoClient } = require('mongodb');
const express = require("express");
const bodyParser = require('body-parser');
const dbConn = require("./dbConnection.js")


const profile = process.env.PROFILE || "development";
const config = require('./config/config.json');
let appConfig = config.development;
if (profile === 'production'){
  console.log("Application Profile is ", profile)
  appConfig = config.production;
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || appConfig.exposedPort;

/**
 * call getdbConn, then use MongoClient to connect to Mongo Database based on URI
 * <p>
 *   It creates Database if not exist, then create a Collection if not exist
 * </p>
 * @type {Promise<Collection<Document>>}
 */

const createReading = (email, systolic, diastolic, category) => {
  return {
    email: email,
    systolic: systolic,
    diastolic: diastolic,
    category: category,
    timestamp: Date.now(),
  };
}


const collection = dbConn.getCollection(appConfig);
collection.then(c => console.log("Successfully Connected to mongo database ", c.dbName , " and collection ", c.collectionName));


app.listen(PORT, () => {
  console.log("Server running on port "+ PORT);
});

app.post('/', (req, res) => {
  let record = createReading(req.body.email, req.body.systolic, req.body.diastolic, req.body.category);
  console.log('Got recording:', record);
  collection.then(c => c.insertOne(record))
                                .then(result => res.json({'id': result.insertedId, 'ak':result.acknowledged }));
});

app.get('/health', (req, res) => {
  collection.then(c=> c.stats()).then(r =>
    res.status(200).json(r));
});

app.get('/count', (req, res) => {
  collection.then(c=> c.stats()).then(r => {
    console.log("record count "+ r.count);
    res.status(200).json({count: r.count});
  });
});
