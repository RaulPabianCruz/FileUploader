const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const validator = require('./validate');
const db = require('../db/query');

const getFile = asyncHandler(async (req, res) => {
    const file = await db.getFile(Number(req.params.file));
    const formattedTime = file.createdAt.toLocaleString();
    res.render('file', {
        title: 'File View',
        file: file,
        formattedTime: formattedTime,
    });
});

const getFileUpdateForm = asyncHandler(async (req, res) => {
    const folders = await db.getUserFolders(req.user.id);
    const file = await db.getFile(Number(req.params.file));
    res.render('updateFile', {
        title: 'File Update',
        folders: folders,
        file: file,
    });
});

const getDownloadFile = [
    validator.validateFileIdQuery, 
    asyncHandler(async (req, res) => {
        const file = await db.getFile(req.query.fileId);

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const formattedTime = file.createdAt.toLocaleString();
            return res.status(400).render('file', {
                title: 'File View',
                file: file,
                formattedTime: formattedTime,
                errors: errors.array(),
            });
        }

        res.redirect(file.fileURL);
    })
];

const deleteFile = [
    validator.validateFileId,
    asyncHandler(async (req, res) => {
        const fileId = req.body.fileId;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).redirect(`/${req.user.id}/home`);
        }

        await db.deleteFile(Number(fileId));
        //redirects here for now
        res.redirect(`/${req.user.id}/home`);
    })
]

const postFileUpdate = [
    validator.validateFile,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const folderId = req.body.folderId;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const folders = await db.getUserFolders(req.user.id);
            const file = await db.getFile(Number(req.params.file));
            return res.render('updateFile', {
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
    getDownloadFile,
    postFileUpdate,
    deleteFile,
};