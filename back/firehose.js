import aws from 'aws-sdk';

const accessKeyId ="AKIAQBRBP4Z6WNDOUJHF"
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