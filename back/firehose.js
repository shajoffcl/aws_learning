import aws from 'aws-sdk';

const accessKeyId ="AKIAXZWU6EN5QTU2E766"
const secretAccessKey = "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"

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