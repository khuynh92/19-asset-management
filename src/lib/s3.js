import fs from 'fs-extra';
import aws from 'aws-sdk';

const s3 = new aws.S3();

const upload = (path, key) => {
  let config = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  };

  return s3.upload(config)
    .promise()
    .then(res => {

      return fs.remove(path)
        .then(()=> res.Location);
    })
    .catch(err => {
      return fs.remove(path)
        .then(() => Promise.reject(err));
    });
};

const remove = (key) => {
  return s3.deleteObject({
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  })
    .promise()
    .then(success =>success)
    .catch(err => Promise.reject(err));
};



export default {upload, remove};