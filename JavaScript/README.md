This folder contains demo sample for Node.js

The sample requires xml2js module. Install it by 'npm install xml2js' command.

Before you start, you need to provide correct Application Id and Password in test.js file.

!!! IMPORTANT !!!

This sample is configured to recognize English documents only.
If you are working with other languages, set comma-separated
list of languages in test.js before calling processImage function.

_`./env.abbyy` sample:_
```
ABBYY_APP_ID=<ABBYY_APP_ID>
ABBYY_APP_PASSWORD=<ABBYY_APP_PASSWORD>
ABBYY_SERVICE_URL="http://cloud-eu.ocrsdk.com"
```

Test files should be put to `${filesBasePath}`. Then you have to set input and output filenames in `./test.js` (see code below):
```js
// ...
const filesBasePath = path.resolve(process.cwd(), './image-sample');
const imagePath = `${filesBasePath}/sample-2-blured.jpg`;
const outputPath = `${filesBasePath}/result-2.txt`;
// ...
```
