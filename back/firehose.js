'use strict';
// import aws from 'aws-sdk';

const aws = require('aws-sdk');

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const firehose = new aws.Firehose({
     region: "ap-south-1",
     signatureVersion: 'v4',
     accessKeyId,
     secretAccessKey
})

const params = {
     DeliveryStreamName: 'Testing stream',
     DeliveryStreamType: "DirectPut",
     //Data: JSON.stringify({name: 'shaib', age: 26})
}

firehose.createDeliveryStream(params, function (err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
});