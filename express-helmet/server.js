const express = require('express');
const helmet = require('helmet');

const app = express();

// helmetを実装
app.use(helmet());

app.get('/hoge', (req, res) => {
  res.send('fuga');
});

app.listen(3000, () => {
  console.log('server start ... localhost:3000');
});