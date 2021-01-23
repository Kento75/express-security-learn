const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  "origin": "http://hogehoge.com",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

app.get('/hoge', cors(corsOptions), (req, res) => {
  res.send('fuga');
});

app.listen(3000, () => {
  console.log('server start ... localhost:3000');
});