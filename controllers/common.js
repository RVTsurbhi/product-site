/******** Helpers **********/
const fs = require('fs');
const util = require('util')
const awsHelper = require('../helpers/aws');
const responseHelper = require('../helpers/responses');

/******* upload image ********/
const uploadImage = async(req, res, next)=>{
    try{
        if(!req.files){
            throw Error("File is required");
        } else {
            let readfile = util.promisify(fs.readFile)
            let unlinkfile = util.promisify(fs.unlink)
            let attachments = []
            await Promise.all(req.files.map(async (item) => {
                let dataContent = await readfile(item.path);
                let fileName = item.filename
                //saving file to s3
                let image = await awsHelper.uploadToS3(dataContent, fileName)
                if(image.message){
                    throw Error(image.message)
                }
                attachments.push(image);    
                //delete file from local
                await unlinkfile(item.path)
            }))
            responseHelper.data(res, attachments, 200, 'files uploaded successfully');
        }
    } catch (error){
        next(error)
    }
}

module.exports = {
    uploadImage
}