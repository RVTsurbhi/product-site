const AWS = require('aws-sdk');
const { S3_BUCKET_NAME, ACCESS_KEY, SECRET_KEY } = process.env;

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
});


const uploadToS3 = async (fileData, fileName)=>{
	try{
        const uploadData = await s3.upload({
			Body: fileData,
			Key: fileName,
			Bucket: S3_BUCKET_NAME,
			ACL: 'public-read' 
		}).promise()

		// console.log('response:', uploadData.Location)
		return uploadData.Location;
	}catch(err){
		return err
	}
}

module.exports={
    uploadToS3
}