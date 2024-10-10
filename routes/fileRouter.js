const { Router } = require('express');
const fileController = require('../controllers/fileController');

const router = new Router({ mergeParams: true });

router.get('/:file', fileController.getFile);
//router.get('/:file/updateFile', );
//router.post('/:file/deleteFile', );
//router.post('/:file/updateFile', );

module.exports = router;