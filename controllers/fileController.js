const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const validator = require('./validate');
const db = require('../db/query');

const getFile = asyncHandler(async (req, res) => {
    const file = await db.getFile(Number(req.params.file));
    res.render('file', {
        title: 'File View',
        file: file,
    });
});

const getFileUpdateForm = asyncHandler(async (req, res) => {
    const folders = await db.getUserFolders(req.user.id);
    const file = await db.getFile(Number(req.params.file));
    res.render('fileUpdate', {
        title: 'File Update',
        folders: folders,
        file: file,
    });
});

const postFileUpdate = [
    validator.validateFile,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const folderId = req.body.folderId;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const folders = await db.getUserFolders(req.user.id);
            const file = await db.getFile(Number(req.params.file));
            return res.render('fileUpdate', {
                title: 'File Update',
                folder: folders,
                file: file,
                errors: errors.array(),
            });
        }

        await db.updateFile(Number(req.params.file), name, folderId);
        //for now it will redirect here
        res.redirect(`/${req.user.id}/home`);
    })
];

module.exports = {
    getFile,
    getFileUpdateForm,
    postFileUpdate,
};