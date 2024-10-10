const { Router } = require('express');
const folderController = require('../controllers/folderController');

const router = new Router({mergeParams: true});

router.get('/:folder', folderController.getFolder);
router.get('/:folder/updateFolder', folderController.getFolderUpdateForm);
router.post('/:folder/deleteFolder', );
router.post('/:folder/updateFolder', folderController.postFolderUpdate);

module.exports = router;