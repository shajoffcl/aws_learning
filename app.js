'use strict';
import express from 'express'
import { generateUploadURL } from './back/s3.js'

const app = express()

app.use(express.static('front'))
app.use(express.json());

app.get("/health", (req, res)=> {
  res.json({serverTime: new Date().getTime()})
})

app.post('/s3Url', async (req, res) => {
  try {
    const result = await generateUploadURL(req.body);
    res.send(result)
  } catch (error) {
    res.send({code: 1000, msg: 'some error', data: {}});
  }
})

app.listen(3000, () => console.log("listening on port 3000"))