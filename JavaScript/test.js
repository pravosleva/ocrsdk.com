// Demo sample using ABBYY Cloud OCR SDK from Node.js

if (((typeof process) == 'undefined') || ((typeof window) != 'undefined')) {
	throw new Error("This code must be run on server side under NodeJS");
}

/*
	To create an application and obtain a password,
	register at https://cloud.ocrsdk.com/Account/Register
	More info on getting your application id and password at
	https://ocrsdk.com/documentation/faq/#faq3

	Change to http://cloud-westus.ocrsdk.com for applications created in US location
	Change to https for secure connection
*/

// Name and password should be taken from envs
// Password should be sent to your e-mail after application was created
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const cfg = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env.abbyy')))
for (const k in cfg) process.env[k] = cfg[k];
const { ABBYY_APP_ID, ABBYY_APP_PASSWORD, ABBYY_SERVICE_URL } = process.env;

const filesBasePath = path.resolve(process.cwd(), './image-sample');
const imagePath = `${filesBasePath}/sample-2-blured.jpg`;
const outputPath = `${filesBasePath}/result-2.txt`;


try {
	console.log('---\nABBYY Cloud OCR SDK Sample for Node.js\n---\n');

	// Step 1: Create files dir if necessary:
	try {
		fs.accessSync(filesBasePath);
		// Go on...
	} catch (err) {
		console.log(`NO ACCESS: ${filesBasePath}`);
		console.log(err);

		fs.mkdirSync(filesBasePath, function(err) {
			if (err) {
				console.log('ERROR', err);
				process.exit(1);
			}
			try {
				fs.accessSync(filesBasePath);
				console.log(`CREATED: ${filesBasePath}`);
				console.log('BUT EMPTY!');
				process.exit(1);
			} catch (err) {
				console.log(`COULD NOT BE CREATED: ${filesBasePath}`);
				console.log(err);
				process.exit(1);
			}
		});
	}

	// Step 2: Throw if necessary:
	if (!ABBYY_APP_ID || !ABBYY_APP_PASSWORD) {
		throw new Error('Please provide your application id and password!')
		return;
	}

	var ocrsdkModule = require('./ocrsdk.js');
	var ocrsdk = ocrsdkModule.create(ABBYY_APP_ID, ABBYY_APP_PASSWORD, ABBYY_SERVICE_URL);

	function downloadCompleted(error) {
		if (error) {
			console.log("Error: " + error.message);
			return;
		}
		console.log("Done.");
	}

	function processingCompleted(error, taskData) {
		if (error) {
			console.log("Error: " + error.message);
			return;
		}

		if (taskData.status != 'Completed') {
			console.log("Error processing the task.");
			if (taskData.error) {
				console.log("Message: " + taskData.error);
			}
			return;
		}

		console.log("Processing completed.");
		console.log("Downloading result to " + outputPath);

		ocrsdk
			.downloadResult(taskData.resultUrl.toString(), outputPath, downloadCompleted);
	}

	function uploadCompleted(error, taskData) {
		if (error) {
			console.log("Error: " + error.message);
			return;
		}

		console.log("Upload completed.");
		console.log("Task id = " + taskData.id + ", status is " + taskData.status);
		if (!ocrsdk.isTaskActive(taskData)) {
			console.log("Unexpected task status " + taskData.status);
			return;
		}

		ocrsdk.waitForCompletion(taskData.id, processingCompleted);
	}

	var settings = new ocrsdkModule.ProcessingSettings();
	// Set your own recognition language and output format here
	settings.language = "Russian,English"; // Can be comma-separated list, e.g. "German,French".
	settings.exportFormat = "txt";	// All possible values are listed in 'exportFormat' parameter description
																	// at https://ocrsdk.com/documentation/apireference/processImage/

	console.log("Uploading image..");
	ocrsdk.processImage(imagePath, settings, uploadCompleted);

} catch (err) {
	console.log("Error: " + err.message);
}
