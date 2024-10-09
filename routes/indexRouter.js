const { Router } = require('express');
const indexController = require('../controllers/indexController');
const auth = require('./authMiddleware');

const router = new Router();

//router.use('/:user/folder', );
//router.use('/:user/file', );

router.get('/', indexController.getIndexPage);
router.get('/signup', indexController.getSignupPage);
router.get('/login', indexController.getLoginPage);
router.get('/logout', auth.isAuth, indexController.logoutUser);
router.get('/:user/home', auth.isAuth, indexController.getHomePage);
router.get('/:user/addFile', auth.isAuth, indexController.getAddFileForm);
router.get('/:user/addFolder', auth.isAuth, indexController.getAddFolderForm);
router.post('/signup', indexController.postSignup);
router.post('/login', indexController.postLogin);
router.post('/:user/addFile', auth.isAuth, indexController.postAddFile);
router.post('/:user/addFolder', auth.isAuth, indexController.postAddFolder);

module.exports = router;