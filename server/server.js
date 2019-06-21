const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { calcData } = require('./utils/data');
const DEFAULT_PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || DEFAULT_PORT;

const router = express.Router();

app.use('/api/v1', router);

router.get('/data', (req, res) => {
  const data = calcData();
  res.send({
    status: 'ok',
    statusCode: 200,
    data: data
  });
});

router.get('/data/:dataSets', (req, res) => {
  const data = calcData(req.params.dataSets);
  res.send({
    status: 'ok',
    statusCode: 200,
    data: data
  });
});

app.listen(port);
console.log('Server is listening on port', port);