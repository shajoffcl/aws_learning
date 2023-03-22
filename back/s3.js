'use strict';
import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from "util"
const randomBytes = promisify(crypto.randomBytes)

const s3URL  = 'https://shaj-personal-upload.s3.ap-south-1.amazonaws.com/'
const region = "ap-south-1"
const bucketName = "shaj-personal-upload"
// const accessKeyId ="AKIAJTRGUDBMNN5ABULQ"
// const secretAccessKey = "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"
const accessKeyId ="AKIAXZWU6EN5QTU2E766"
const secretAccessKey = "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"
const default_path = 'showdown/assets/';
const file_size = {
  MIN_SIZE: 100,
  MAX_SIZE: 10000000
}

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})



function isFileInvalid(fileName) {
  if(!fileName) return true;
  let ext = fileName.substr(fileName.lastIndexOf("."));
  console.log('file ext:', ext);
  if(!['.jpg', '.jpeg', '.png'].includes(ext)) {
       return true
  }
  return false;
}

async function getUniqueKey() {
  try {
       const rawBytes = await randomBytes(16)
       const unique = rawBytes.toString('hex')
       return unique;
  } catch (error) {
       return parseInt(Math.random().toFixed(16).replace("0.",""))
  }
}


export async function generateUploadURL(requestObj) {
  const {name: fileName, type: contentType, uploadPath = default_path} = requestObj;
  try {

    if(isFileInvalid(fileName)) {
      console.log('ext failed');
      return {code: 1024, msg: 'Please upload the file of .jpg type', data: {}}
    }

    const unique = await getUniqueKey();

    let key = uploadPath + unique + '_' + fileName;

    const params = {
      Bucket: bucketName,
      Expires: 60,
      Conditions: [
        ['content-length-range', file_size.MIN_SIZE, file_size.MAX_SIZE], // up to 1 MB //1048576
        ['starts-with', '$key', key],
        ["starts-with", "$Content-Type", contentType]
      ],
      Fields: {
        "Content-Type": contentType,
        key: key
      }
    }

    const presignedPostData = await s3.createPresignedPost(params);
    console.log(presignedPostData);
    
    const urlAccessData = {
      url: s3URL + key
    };

    return {code: 200, msg: 'success', data: {presignedPostData, urlAccessData}};
  } catch (error) {
    console.log(error);
    throw error;
  }
}