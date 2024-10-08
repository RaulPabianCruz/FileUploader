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
//router.get('/:user/addFile', );
//router.get('/:user/addFolder', );
router.post('/signup', indexController.postSignup);
router.post('/login', indexController.postLogin);
//router.post('/:user/addFile', );
//router.post('/:user/addFolder', );

module.exports = router;