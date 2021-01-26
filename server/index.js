const keys = require('./keys');

// Express App setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // turns the body of the POST request into json so the API can work with


// PostgreSQL client setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

// creating the table to persist the submitted values
pgClient.on('connect', client => {
    client
      .query('CREATE TABLE IF NOT EXISTS values (number INT)')
      .catch((err) => console.log(err));
  });


// Redis Client setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
  // retry every 1000ms if disconnected
});
const redisPublisher = redisClient.duplicate();
// when a redis client is listening it cannot be used for other functions
// that is why there is a redisClient duplication happening so the listener can function properly


// Express Route handlers
app.get('/', (req, res) => {
    res.send('Hi');
  });
  
  app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');
  
    res.send(values.rows);
    // only sends back values not query data
  });

// redis library does not support promises out of the box
// must use call back function instead of async/await
app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
      res.send(values);
    });
  });

app.post('/values', async (req, res) => {
    const index = req.body.index;
    // putting check in for high number because of the recursive function
    // that performs the fib calculation
    if (parseInt(index) > 40) {
      return res.status(422).send('Index too high');
    }
    // a prompt to say the function is working
    redisClient.hset('values', index, 'Nothing yet!');
    // the duplicated redis server to actually calculate
    redisPublisher.publish('insert', index);
    // actually insert the submitted value
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  
    res.send({ working: true });
  });

  app.listen(5000, (err) => {
    console.log('Listening');
  });