# removd

[![NPM version](https://img.shields.io/npm/v/removd.svg)](https://npmjs.org/package/removd)
[![Downloads](https://img.shields.io/npm/dm/removd.svg)](https://npmjs.org/package/removd)
[![CircleCI](https://img.shields.io/circleci/project/github/przemyslawpluta/removd/master.svg)](https://circleci.com/gh/przemyslawpluta/removd/tree/master)

Automatic ai cut outs of people and products with [remove.bg](https://www.remove.bg) service.

![splash](assets/splash/splash.jpg?raw=true)

## Requirements

API key from [remove.bg](https://www.remove.bg/profile#api-key) service

## Installation

```bash
npm i removd
```

## Examples

Multiple examples can be located in [examples](https://github.com/przemyslawpluta/removd/blob/master/examples) directory

## Usage

Images can be processed using [file](https://github.com/przemyslawpluta/removd#removdfile), [url](https://github.com/przemyslawpluta/removd#removdurl) and [base64](https://github.com/przemyslawpluta/removd#removdbase64) workflows.

### removd.file

File workflow allows to upload files and save its outcome. Available options:

- **source** `required (string || array)` - source filename to be forwarded for processing. Can be either single file or array of files (**.png**, **.jpg**, **.jpeg** files are supported).
- **glob** `optional (boolean)` - glob patterns can be used to match files in multiple directories.
- **size** `optional (string)` - can be set to **regular**, **medium**, **hd**, **4k**, **auto**. If omitted image will be automatically recognised and correct `size` option will be assigned.
- **detect** `optional (string)` - can be set to **person**, **product**, **auto**. If omitted image will be automatically recognised.
- **channels** `optional (string)` - can be set to **rgba**, **alpha**. If omitted defaults to **rgba** as RGB color corrections is used for highest quality.
- **background** `optional (string)` - can be set to hex color code RGB, RGBA, RRGGBB, RRGGBBAA e.g. **81d4fa77** or rgba colors (R, G, B), (R, G, B, A), rgba(R, G, B, A) e.g. **rgba(197, 127, 73, .5)** or color name e.g. **red**, **green** etc. If omitted defaults to fully transparent hex.
- **format** `optional (string)` - can be set to **auto**, **png**, **jpg** format. If omitted defaults to PNG format if transparent regions exists, otherwise JPEG.
- **destination** `optional (string)` - directory where final image will be saved. Can be either path to directory or path to filename. If directory specyfied source filename will be used for saved outcome. If filename specyfied all processed images would be saved with it. If file already exists new file will be suffixed with nine character short id (defaults to `source` image directory).
- **deleteOriginal** `optional (boolean)` - source image can be deleted after outcome returned back and saved (defaults to `false`).
- **apikey** `optional (string)` - service api key (defaults to REMOVD_API_KEY env veriable).

### Basic file usage

```js
const removd = require('removd');

(async () => {

    const done = await removd.file({
        source: '/directory/christopher-campbell-28567-unsplash-400x267.jpg'
    });

})();
```

Response `done (object)` will be similar to:

```json
  {
    "charged": 1,
    "size": "regular",
    "duration": "211 ms",
    "dimensions": "400x267",
    "destination": "/directory/christopher-campbell-28567-unsplash-400x267.png",
    "detected": "person",
    "resized": false
  }
```

- charged - amout of credits cherged by service to process image
- size - size set to process image
- duration - time it took to process the image
- dimensions - dimanesions of the image
- destination - directory where outcome image has been saved to
- detected - outcome of the detection process
- resized - if image has been resized or not during processing

### Advanced file usage

```js
await removd.file({
    deleteOriginal: true,
    channels: 'alpha',
    detect: 'person',
    format: 'jpg',
    destination: '/new-directory/christopher-campbell.png',
    source: [
        '/directory/christopher-campbell-28567-unsplash-400x267.jpg',
        '/directory/christopher-campbell-28567-unsplash-2400x1600.jpg'
    ]
});
```

Response `(array)` will be similar to:

```json
[
  {
    "charged": 1,
    "size": "regular",
    "duration": "211 ms",
    "dimensions": "400x267",
    "destination": "/new-directory/christopher-campbell.jpeg",
    "detected": "person",
    "resized": false
  },
  {
    "charged": 5,
    "size": "hd",
    "duration": "371 ms",
    "dimensions": "2400x1600",
    "destination": "/new-directory/christopher-campbell-23TplPdSD.jpeg",
    "detected": "person",
    "resized": false
  }
]
```

If `glob` enabled glob patterns can be used in the source to match images sent for processing:

```js
await removd.file({
    glob: true,
    destination: '/new-directory/',
    background: 'rgba(111, 98, 199, 0.51)',
    source: [
        '/initial-directory/*.jpg',
        '/directory/christopher-campbell-28567-unsplash-2400x1600.jpg'
    ]
});
```

Response `(array)` will be similar to:

```json
[
  {
    "charged": 8,
    "size": "4k",
    "duration": "683 ms",
    "dimensions": "3750x2500",
    "destination": "/new-directory/christopher-campbell-28567-unsplash-3750x2500.png",
    "detected": "person",
    "resized": false
  },
  {
    "charged": 3,
    "size": "medium",
    "duration": "111 ms",
    "dimensions": "1500x1000",
    "destination": "/new-directory/christopher-campbell-28567-unsplash-1500x1000.png",
    "detected": "person",
    "resized": false
  },
  {
    "charged": 5,
    "size": "hd",
    "duration": "371 ms",
    "dimensions": "2400x1600",
    "destination": "/new-directory/christopher-campbell-28567-unsplash-2400x1600.png",
    "detected": "person",
    "resized": false
  }
]
```

### removd.url

Url workflow allows to upload images available via url and save its outcome. Available options:

- **source** `required (string || array)` - source url to be forwarded for processing. Can be either single url or array of urls.
- **detect** `optional (string)` - can be set to **person**, **product**, **auto**. If omitted image will be automatically recognised.
- **channels** `optional (string)` - can be set to **rgba**, **alpha**. If omitted defaults to **rgba** as RGB color corrections is used for highest quality.
- **background** `optional (string)` - can be set to hex color code RGB, RGBA, RRGGBB, RRGGBBAA e.g. **81d4fa77** or rgba colors (R, G, B), (R, G, B, A), rgba(R, G, B, A) e.g. **rgba(197, 127, 73, .5)** or color name e.g. **red**, **green** etc. If omitted defaults to fully transparent hex.
- **format** `optional (string)` - can be set to **auto**, **png**, **jpg** format. If omitted defaults to PNG format if transparent regions exists, otherwise JPEG.
- **destination** `required (string)` - directory where final image will be saved. Can be either path to directory or path to filename. If directory specyfied source url filename will be used for saved outcome. If filename specyfied all processed images would be saved with it. If file already exists new file will be suffixed with nine character short id.
- **size** `optional (string)` - can be set to **regular**, **medium**, **hd**, **4k**, **auto**. If omitted url image will be automatically recognised and correct `size` option will be assigned.
- **apikey** `optional (string)` - service api key (defaults to REMOVD_API_KEY env veriable)

### Basic url usage

```js
const removd = require('removd');

(async () => {

    const done = await removd.url({
        destination: '/directory/',
        source: 'https://images.unsplash.com/photo-1504455583697-3a9b04be6397?w=400&q=80'
    });

})();
```

Response `done (object)` will be similar to:

```json
  {
    "charged": 1,
    "size": "regular",
    "duration": "211 ms",
    "dimensions": "400x267",
    "destination": "/directory/photo-1504455583697-3a9b04be6397.png",
    "detected": "person",
    "resized": false
  }
```

- charged - amout of credits cherged by service to process image
- size - size set to process image
- duration - time it took to process the image
- dimensions - dimanesions of the image
- destination - directory where outcome image has been saved to
- detected - outcome of the detection process
- resized - if image has been resized or not during processing

### Advanced url usage

```js
await removd.url({
    detect: 'person',
    format: 'jpg',
    background: 'red',
    destination: '/new-directory/',
    source: [
        'https://images.unsplash.com/photo-1504455583697-3a9b04be6397?w=400&q=80',
        'https://images.unsplash.com/photo-1504455583697-3a9b04be6397?w=2400&q=80'
    ]
});
```

Response `(array)` will be similar to:

```json
[
  {
    "charged": 1,
    "size": "regular",
    "duration": "211 ms",
    "dimensions": "400x267",
    "destination": "/new-directory/photo-1504455583697-3a9b04be6397l.jpeg",
    "detected": "person",
    "resized": false
  },
  {
    "charged": 5,
    "size": "hd",
    "duration": "371 ms",
    "dimensions": "2400x1600",
    "destination": "/new-directory/photo-1504455583697-3a9b04be6397l-2FF3lddS1.jpeg",
    "detected": "person",
    "resized": false
  }
]
```

### removd.base64

Base64 workflow allows to upload images, base64 and base64url encoded txt files and save its outcome. Available options:

- **source** `required (string || array)` - source filename to be forwarded for processing. Can be either single file or array of files (**.png**, **.jpg**, **.jpeg**, **.txt** files are supported).
- **glob** `optional (boolean)` - glob patterns can be used to match files in multiple directories.
- **size** `optional (string)` - can be set to **regular**, **medium**, **hd**, **4k**, **auto**. If omitted image will be automatically recognised and correct `size` option will be assigned.
- **detect** `optional (string)` - can be set to **person**, **product**, **auto**. If omitted image will be automatically recognised.
- **channels** `optional (string)` - can be set to **rgba**, **alpha**. If omitted defaults to **rgba** as RGB color corrections is used for highest quality.
- **background** `optional (string)` - can be set to hex color code RGB, RGBA, RRGGBB, RRGGBBAA e.g. **81d4fa77** or rgba colors (R, G, B), (R, G, B, A), rgba(R, G, B, A) e.g. **rgba(197, 127, 73, .5)** or color name e.g. **red**, **green** etc. If omitted defaults to fully transparent hex.
- **format** `optional (string)` - can be set to **auto**, **png**, **jpg** format. If omitted defaults to PNG format if transparent regions exists, otherwise JPEG.
- **destination** `optional (string)` - directory where final image will be saved. Can be either path to directory or path to filename. If directory specyfied source filename will be used for saved outcome. If filename specyfied all processed images would be saved with it. If file already exists new file will be suffixed with nine character short id (defaults to `source` image directory).
- **deleteOriginal** `optional (boolean)` - source image can be deleted after outcome returned back and saved (defaults to `false`).
- **toImage** `optional (boolean)` - if source image is a base64 or base64url encoded text file processed outcome can be saved as an image (defaults to `false`).
- **apikey** `optional (string)` - service api key (defaults to REMOVD_API_KEY env veriable)

### Basic base64 usage

```js
const removd = require('removd');

(async () => {

    const done = await removd.base64({
        source: '/directory/christopher-campbell-28567-unsplash-400x267.txt'
    });

})();
```

Response `done (object)` will be similar to:

```json
  {
    "charged": 1,
    "size": "regular",
    "duration": "211 ms",
    "dimensions": "400x267",
    "destination": "/directory/christopher-campbell-28567-unsplash-400x267-g35fgj1Sp.txt",
    "detected": "person",
    "resized": false
  }
```

- charged - amout of credits cherged by service to process image
- size - size set to process image
- duration - time it took to process the image
- dimensions - dimanesions of the image
- destination - directory where outcome image has been saved to
- detected - outcome of the detection process
- resized - if image has been resized or not during processing

### Advanced base64 usage

```js
await removd.base64({
    toImage: true,
    destination: '/new-directory/christopher-campbell.png',
    background: '00afff1f',
    source: [
        '/directory/christopher-campbell-28567-unsplash-400x267.jpg',
        '/directory/christopher-campbell-28567-unsplash-2400x1600.txt'
    ]
});
```

Response `(array)` will be similar to:

```json
[
  {
    "charged": 1,
    "size": "regular",
    "duration": "211 ms",
    "dimensions": "400x267",
    "destination": "/new-directory/christopher-campbell.png",
    "detected": "person",
    "resized": false
  },
  {
    "charged": 5,
    "size": "hd",
    "duration": "371 ms",
    "dimensions": "2400x1600",
    "destination": "/new-directory/christopher-campbell-56T11Ptk3.png",
    "detected": "person",
    "resized": false
  }
]
```

## Errors

All erros are resolved and fallow similar convention:

```js
const removd = require('removd');

(async () => {

    const done = await removd.file({
        source: '/directory/christopher-campbell-28567-unsplash-400x267.bmp'
    });

})();
```

Response `done (object)` will be similar to:

```json
  {
    "error": "Unsupported file format",
    "source": "/directory/christopher-campbell-28567-unsplash-400x267.bmp"
  }
```

## Enviroment variables

To limit batch processing use **REMOVD_BATCH_LIMIT** (defaults to cpu count).

```batch
REMOVD_BATCH_LIMIT=2
```

To control file check delay use **REMOVD_ISFILE_DELAY** (defaults to 200ms).

```batch
REMOVD_ISFILE_DELAY=50
```

## Tests

To run all available tests against previously recorded mocks

```bash
npm test
```

To record mocks either remove [fixtures](https://github.com/przemyslawpluta/removd/blob/master/fixtures) or force record with **NOCK_RECORD**

```bash
NOCK_RECORD=true npm test
```

As record is done against actual API endoints you'll be charged relevant amount of credits per test sequence.

| Workflow | Credits |
|------|--------:|
|file|72|
|url|60|
|base64|54|

In total you'd be charged `186 credits` for all available tests.

## License

The MIT License (MIT). Please see [license](https://github.com/przemyslawpluta/removd/blob/master/LICENSE) file for more information.