const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const validator = require('./validate');
const db = require('../db/query');

const getFolder = asyncHandler(async (req, res) => {
    const folderId = Number(req.params.folder);
    const folder  = await db.getFolder(folderId);
    const folders = await db.getChildrenFolders(folderId);
    const files = await db.getFolderFiles(folderId);
    res.render('home', {
        title: folder.name,
        currentFolderId: folder.id,
        folders: folders,
        files: files,
    });
});

module.exports = {
    getFolder,
};