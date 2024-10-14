require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dd2jc4tpn',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async function(fileLocation) {
    const result = await cloudinary.uploader.upload(fileLocation, {
        resource_type: 'auto',
    });

    console.log('Result: -------------------------');
    console.log(result);

    const fileURL = cloudinary.url(result.public_id, {
        flags: 'attachment',
        resource_type: result.resource_type,
    });

    return fileURL;
}

module.exports = {
    uploadFile
};