const express = require('express');

const cookieParser = require('cookie-parser');
const session = require('express-session');

// redis設定
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

const app = express();
app.use(cookieParser());
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
    cookie: { httpOnly: true, secure: false, maxage: 1000 * 60 * 30 }
}));

app.get('/', (req, res) => {
  if (req.session.views) {
      req.session.views++;
  } else {
      req.session.views = 1;
  }
    res.json({
        'sessionID': req.sessionID,
        'req.session.views': req.session.views
    });
})

app.listen(3000, () => {
  console.log('server start ... localhost:3000');
});
