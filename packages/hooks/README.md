# `expresso-hooks`

> expresso-hooks for expressjs

## Usage

```js

// commonjs
const _ = require('lodash');
const { useMulter } = require('expresso-hooks');

// ES6
import _ from 'lodash';
import { useMulter } from 'expresso-hooks';

const uploadFile = useMulter({
  dest: 'public/uploads',
}).fields([{ name: 'fileUpload', maxCount: 1 }])

const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res,
  next: NextFunction
) {
  const fileUpload = req.pickSingleFieldMulter(['fileUpload'])

  req.setBody(fileUpload)
  next()
})

route.put('/upload', your_middleware, uploadFile, setFileToBody,
  asyncHandler(async function update(req: Request, res: Response) {

    const fieldUpload = _.get(formData, 'fileUpload', {}) as FileAttributes

    //... your handler
  })
)
```
