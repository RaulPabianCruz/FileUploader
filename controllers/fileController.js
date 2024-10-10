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

module.exports = {
    getFile,
};