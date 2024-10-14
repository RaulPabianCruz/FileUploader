const { body, query } = require('express-validator');

const lengthErr = ' must be between 1 and 20 characters.';

const validateUserInfo = [
    body('firstname').trim()
    .isAlpha('en-US', {ignore: '-'}).withMessage('First Name can only consist of alphabetical letters and hyphens(-).')
    .isLength({min: 1, max: 20}).withMessage('First Name' + lengthErr),
    body('lastname').trim()
    .isAlpha('en-US', {ignore: '[\s-]'}).withMessage('Last Name can only consist of alphabetical letters, spaces, and hyphens(-).')
    .isLength({min: 1, max: 25}).withMessage('Last Name must be between 1 and 25 characters.'),
    body('username').trim()
    .isAlphanumeric('en-US', {ignore: '[\s-]'}).withMessage('Username can only consist of alphabetical letters, numbers, spaces, and hyphens(-).')
    .isLength({min: 1, max: 20}).withMessage('Username' + lengthErr),
    body('password').trim()
    .isAlphanumeric('en-US', {ignore: '[!@&$]'}).withMessage('Password can only consist of alphabetical letters, numbers, and special characters(!, @, &, $).')
    .isLength({min: 1, max: 15}).withMessage('Password must be between 1 and 15 characters.'),
    body('passconfirm').trim()
    .custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage('Confirm Password filed must match password.')
];

const validateLogin = [
    validateUserInfo[2],
    validateUserInfo[3],
];

const validateFile = [
    body('name').trim()
    .isAlphanumeric('en-US', { ignore: '[._-]' }).withMessage('File Name must only consist of alphabetical letters, numbers, hyphens, underscores, and periods.')
    .isLength({min: 1, max: 20}).withMessage('File Name' + lengthErr),
    body('folderId').toInt()
    .isInt().withMessage('Folder choice invalid.')
];

const validateFolder = [
    body('name').trim()
    .isAlphanumeric('en-US', { ignore: '[_-]' }).withMessage('Folder Name must only consist of alphabetical letters, numbers, hyphens, and underscores.')
    .isLength({min: 1, max: 20}).withMessage('Folder Name' + lengthErr),
    body('parentFolderId').toInt()
    .isInt().withMessage('Folder choice invalid.')
];

const validateFileId = [
    body('fileId').toInt().isInt().withMessage('Invalid File.')
];

const validateFolderId = [
    body('folderId').isInt().withMessage('Invalid Folder')
];

const validateFileIdQuery = [
    query('fileId').toInt().isInt().withMessage('Invalid File.')
];

module.exports = {
    validateUserInfo,
    validateLogin,
    validateFile,
    validateFolder,
    validateFileId,
    validateFolderId,
    validateFileIdQuery,
};