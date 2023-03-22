const imageForm = document.querySelector("#imageForm")
const imageInput = document.querySelector("#imageInput")

const MAX_FILE_SIZE = 10000000;

function fileValidation(files={}) {
  let flag = true;

  if(!files || typeof files != 'object') {
    return flag = false;
  } else {console.log({data: files, msg: 'files data'});}

  let filesArray = Object.keys(files).map(k=> files[k]);

  if(filesArray.length == 0) {
    return flag = false;
  } else {console.log({len:filesArray.length, msg: 'length'});}

  filesArray.map(file => ({size: file.size, name: file.name})).forEach( obj => {
    let fileName = obj.name;
    let ext = fileName.substr(fileName.lastIndexOf("."));
    console.log('file ext:', ext);

    if(!['.jpg', '.jpeg', '.png'].includes(ext)) {
      console.log('ext failed');
      return flag = false;
    }

    if(obj.size > MAX_FILE_SIZE) {
      console.log('size failed');
      return flag = false;
    }
  });
  return flag;
}

const getPresignedPostData = selectedFile => {
  return new Promise(resolve => {
    const url = "/s3Url";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        name: selectedFile.name,
        type: selectedFile.type,
        uploadPath: 'contest/'
      })
    );
    xhr.onload = function() {
      resolve(JSON.parse(this.responseText));
    };
  });
};

const uploadFileToS3 = (presignedPostData, file) => {
  return new Promise(async (resolve, reject) => {
    const {fields, url} = presignedPostData;
    
    const formData = new FormData();
    Object.keys(fields).forEach(key => {
      formData.append(key, fields[key]);
    });
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.send(formData);
    xhr.onload = function() {
      this.status === 204 ? resolve(this.responseText) : reject(this.responseText);
    };
  });
};


function showMsgOnPage(msg) {
  let p = document.createElement('p');
  p.innerText = msg;
  document.body.appendChild(p);
  return;
}

imageForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const file = imageInput.files[0];

  if(!fileValidation(imageInput.files)) {
    showMsgOnPage('Invalid file');
    return;
  } // client side validation

  let response = {}
  try {
    console.time('postUrl time')
    response = await getPresignedPostData(file);
    console.timeEnd('postUrl time')
  } catch (error) {
    console.log("An error occurred!", error);
  }

  let {code, data, msg} = response;

  if(code != 200) {
    showMsgOnPage(msg);
    return;
  }

  let {presignedPostData, urlAccessData} = data;

  console.log(presignedPostData, 'post');

  try {
    console.time('exec');
    const res = await uploadFileToS3(presignedPostData, file);
    showMsgOnPage('File successfully uploaded!');
    console.timeEnd('exec');
    console.log({res, msg: 'upload res'});
    console.log("File was successfully uploaded!");
  } catch (e) {
    console.log("An error occurred!", e);
  }
  
  const img = document.createElement("img")
  img.src = urlAccessData.url
  document.body.appendChild(img)
})




// get secure url from our server
  // const result = await fetch("/s3Url").then(res => res.json())
  // console.log(result)

  // const {uploadURL, key} = result;

  // console.log(url);

  // post the image direclty to the s3 bucket
  // const res = await fetch(url, {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": "multipart/form-data"
  //   },
  //   body: file
  // })

  // console.log(res, 'response');

  // const imageUrl = url.split('?')[0]
  // console.log(imageUrl)