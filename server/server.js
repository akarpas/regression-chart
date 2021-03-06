const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { calcData } = require('./utils/data');
const DEFAULT_PORT = 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '2000kb' }));

const port = process.env.PORT || DEFAULT_PORT;

const router = express.Router();

app.use('/api/v1', router);

// Get request for standard of 3 data sets
router.get('/data', (req, res) => {
  const data = calcData();
  res.send({
    status: 'ok',
    statusCode: 200,
    data
  });
});

// Get request for dynamic data sets using parameters
router.get('/data/:dataSets', (req, res) => {
  const data = calcData(req.params.dataSets);
  res.send({
    status: 'ok',
    statusCode: 200,
    data
  });
});

app.listen(port);
console.log('Server is listening on port', port);