const { Router } = require('express');
const fileController = require('../controllers/fileController');

const router = new Router({ mergeParams: true });

router.get('/:file', fileController.getFile);
router.get('/:file/updateFile', fileController.getFileUpdateForm);
router.get('/:file/download', fileController.getDownloadFile);
router.post('/:file/deleteFile', fileController.deleteFile);
router.post('/:file/updateFile', fileController.postFileUpdate);

module.exports = router;