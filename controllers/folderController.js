const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const validator = require('./validate');
const db = require('../db/query');

const getFolder = asyncHandler(async (req, res) => {
    const folder  = await db.getFolder(Number(req.params.folder));
    const folders = await db.getChildrenFolders(folder.id);
    const files = await db.getFolderFiles(folder.id);
    res.render('home', {
        title: folder.name,
        currentFolderId: folder.id,
        folders: folders,
        files: files,
    });
});

const getFolderUpdateForm = asyncHandler(async (req, res) => {
    const folder = await db.getFolder(Number(req.params.folder));
    const folders = await db.getOtherFolders(req.user.id, folder.id);
    res.render('updateFolder', {
        title: 'Folder Update',
        currentFolder: folder,
        folders: folders
    });
});

const deleteFolder = [
    validator.validateFolderId,
    asyncHandler(async (req, res) => {
        const folderId = Number(req.body.folderId);

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).redirect(`/${req.user.id}/home`);
        }

        await db.deleteFolder(folderId);
        res.redirect(`/${req.user.id}/home`);
    })
];

const postFolderUpdate = [
    validator.validateFolder,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const parentFolderId = req.body.parentFolderId;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const folder = await db.getFolder(Number(req.params.folder));
            const folders = await db.getOtherFolders(req.user.id, folder.id);
            res.status(400).render('updateFolder', {
                title: 'Folder Update',
                currentFolder: folder,
                folders: folders,
                errors: errors.array(),
            });
        }

        await db.updateFolder(Number(req.params.folder), name, parentFolderId);
        //redirect here for now
        res.redirect(`/${req.user.id}/home`);
    })
];

module.exports = {
    getFolder,
    getFolderUpdateForm,
    deleteFolder,
    postFolderUpdate,
};