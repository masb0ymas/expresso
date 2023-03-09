# `expresso-core`

> Core Helpers for expressjs

## Usage CommonJS

```js
// commonjs

const { currency } = require('expresso-core')

```

## Usage ES6


```js
// ES6

import { currency } from 'expresso-core'

```

## Currency

### Format with national symbol currency

```js
import { currency } from 'expresso-core'

const result = currency.format({
  nominal: 125000,
  options: { locale: 'id-ID', currency: 'IDR' },
})

console.log(result)

// output :
'Rp 125.000'
```

### Format Nominal

```js
import { currency } from 'expresso-core'

const result = currency.format({ nominal: 125000 })

console.log(result)

// output :
'125.000'
```

## Random String

### Default random string

```js
import { randomString } from 'expresso-core'

const result = randomString.generate()

console.log(result)

// output :
'aq52PvnFrtvsX6rtA8MLj27xR2HcEJht'
```

### Other random string


```js
import { randomString } from 'expresso-core'

const result = randomString.generate(10)

console.log(result)

// output :
'aq52PvnFrt'

const result = randomString.generate({
  type: 'alphabetNumeric',
  length: 10,
})

console.log(result)

// output :
'7xR2HcEJht'
```