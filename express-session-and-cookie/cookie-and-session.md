# Cookie 保持の方法

cookie 管理は以下の 2 種類のミドルウェアが用意されている。

1. express-session
2. cookie-session

※ express-session は、メモリ内にデータを持つか、外部データストレージ(Redis とか)を利用する方法がある。Redis で実装するのが多そうなので cookie-session は割愛。

## express-session + redis の実装

セッション管理を Redis で行う場合、以下のライブラリのインストールが必要。(Redis も用意)

```
npm install cookie-parser redis connect-redis
```

1. cookie-parser => リクエストヘッダーから Cookie を読み取るためのライブラリ。
2. redis、connect-redis => Redis に接続するためのライブラリ。他にもライブラリあるけどこれしか使ったことない。

実装コード。

```
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
      // Redisに登録済みのIDだった場合 + 1
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

```

1 回目、リクエスト送信。

```
$ curl --dump-header - http://localhost:3000/HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 70
ETag: W/"46-/hgqNTR7BqVWPAjd9OvnUjosqqU"
Set-Cookie: connect.sid=s%3AAtwlwHFv4sRhxudl1-opdq1RxbyCxIhR.OTBe92Bp3TmckWqv40G29mbLtN%2BJYzcwfLHastYH7oU; Path=/; HttpOnly
Date: Sat, 23 Jan 2021 10:38:22 GMT
Connection: keep-alive

{"sessionID":"AtwlwHFv4sRhxudl1-opdq1RxbyCxIhR","req.session.views":1}
```

2 回目、セッション ID 付与。

```
$curl -b connect.sid=s%3AAtwlwHFv4sRhxudl1-opdq1RxbyCxIhR.OTBe92Bp3TmckWqv40G29mbLtN%2BJYzcwfLHastYH7oU http://localhost:3000/
{"sessionID":"AtwlwHFv4sRhxudl1-opdq1RxbyCxIhR","req.session.views":2}
```
