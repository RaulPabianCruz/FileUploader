const fs = require('node:fs/promises');

async function deleteFile(fileLocation) {
    await fs.unlink(fileLocation).catch((err) => { console.log(err); });
}

module.exports = {
    deleteFile,
};