# `expresso-provider`

> TODO: description

## Usage

## Mail Provider

```js
// commonjs

const { Mail } = require('expresso-provider');

```

```js
// ES6

import { Mail } from 'expresso-provider';

```

```js
import { Mail } from 'expresso-provider';

const mailService = new Mail({
  driver: 'smtp',
  host: 'smtp.mailtrap.io',
  port: 2525,
  username: String(process.env.MAIL_USERNAME),
  password: String(process.env.MAIL_PASSWORD),
  appName: 'expresso Monorepo',
})

const mailReceiver = 'your_company@domain.com'
const subject = 'Thanks for registration'
const htmlPath = './your_path/email/templates/register.html'

const template = Handlebars.compile(htmlPath)
const htmlToSend = template({
  email: anyMailReceiver,
  fullname: 'test content email',
})

mailService.send(mailReceiver, subject, htmlToSend)
```

## Storage Provider

```js

import { Storage } from 'expresso-provider';

const storageProvider = new Storage({
  provider: 'minio',
  accessKey: String(process.env.STORAGE_ACCESS_KEY),
  secretKey: String(process.env.STORAGE_SECRET_KEY),
  bucket: String(process.env.STORAGE_BUCKET_NAME),
  region: String(process.env.STORAGE_REGION),
  expires: String(process.env.STORAGE_SIGN_EXPIRED),
})

void storageProvider.initial()

```