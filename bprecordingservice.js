const { MongoClient } = require('mongodb');
const express = require("express");
const bodyParser = require('body-parser');

const config = require('./config/config.json');
const defaultConfig = config.development;
global.gConfig = defaultConfig;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || global.gConfig.exposedPort;
const MONGO_CONN_URI = process.env.MONGO_CONN_URI || config.database.connectionUrl
const getDBUri =  () => new Promise((resolve, reject) => resolve(MONGO_CONN_URI));

/**
 * call getDBUri, then use MongoClient to connect to Mongo Database based on URI
 * <p>
 *   It creates Database if not exist, then create a Collection if not exist
 * </p>
 * @type {Promise<Collection<Document>>}
 */
console.log(' MONGO_CONN_URI ' , MONGO_CONN_URI);

const createReading = (email, systolic, diastolic, category) => {
  return {
    email: email,
    systolic: systolic,
    diastolic: diastolic,
    category: category,
    timestamp: Date.now(),
  };
}

const collection = getDBUri()
                  .then(x => { console.log('connectin to mongo uri ', x); return x})
                  .then(uri => MongoClient.connect(uri, { useNewUrlParser: true })
                  .then(conn => conn.db(config.database.name))
                  .then(db => db.collection(config.database.collection)));

collection.then(c => console.log("Mongo ", c.dbName , c.collectionName));

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
