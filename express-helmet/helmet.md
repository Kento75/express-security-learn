# Helmet

Helmet とはセキュリティ強化用ライブラリ。

## Helmet の機能

8 つの脆弱性に対応できる。

1. クロスサイト・スクリプティング攻撃やその他のクロスサイト・インジェクションを防止。
2. X-Powerd-By ヘッダーの削除。
3. SSL/TLS 接続を適用。
4. IE8+ の X-Download-Options を設定。(よくわかってない)
5. クライアント側キャッシュを無効。
6. スニッフィング防止。
7. クリックジャギングの防止。
8. 最新のクロスサイトスクリプティングに対応。

## 導入方法

helmet のインストール

```
$ npm install helmet
```

express ミドルウェアとして実装。

```
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

```

オプションもなく実装しても以下の通り、各種セキュリティ対策ができている。

```
[kento@KentonoMacBook-Pro express-helmet] (main)$ curl --dump-header - http://localhost:3000/hoge
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
X-DNS-Prefetch-Control: off
Expect-CT: max-age=0
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
X-XSS-Protection: 0
Content-Type: text/html; charset=utf-8
Content-Length: 4
ETag: W/"4-6GeXsSWEjmJdcJh8IOQSe7s9tRo"
Date: Sat, 23 Jan 2021 10:11:12 GMT
Connection: keep-alive
```

## 対策できていない部分

SQL インジェクション、セッションハイジャックとかは別の対策が必要。
