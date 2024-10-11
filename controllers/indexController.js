const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const validator = require('./validate');
const db = require('../db/query');

const getIndexPage = (req, res) => {
    res.render('index', {
        title: 'File Uploader', 
    });
}

const getSignupPage = (req, res) => {
    res.render('signup', {
        title: 'Sign Up', 
    });
}

const getLoginPage = (req, res) => {
    res.render('login', {
        title: 'Log In',
    });
}

const logoutUser = (req, res) => {
    req.logout((err) => {
        if(err)
            return next(err);
        res.redirect('/');
    });
}

const getHomePage = asyncHandler(async (req, res) => {
    const homeFolder = await db.getHomeFolder(req.user.id);
    const folders = await db.getChildrenFolders(homeFolder.id);
    const files = await db.getFolderFiles(homeFolder.id);

    res.render('home', {
        title: 'Home Page',
        currentFolderId: homeFolder.id,
        folders: folders,
        files: files,
    });
});

const getAddFileForm = asyncHandler(async (req, res) => {
    const folders = await db.getUserFolders(req.user.id);
    res.render('addFile', {
        title: 'Add File',
        folders: folders,
    });
});

const getAddFolderForm = asyncHandler(async (req, res) => {
    const folders = await db.getUserFolders(req.user.id);
    res.render('addFolder', {
        title: 'Add Folder',
        folders: folders,
    });
});

const postSignup = [
    validator.validateUserInfo,
    asyncHandler(async (req, res) => {
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;
        const username = req.body.username;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('signup', {
                title: 'Sign Up',
                errors: errors.array(),
            });
        }
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if(err)
                return res.status(400);
            await db.insertUser(firstName, lastName, username, hashedPassword);
            res.redirect('/login');
        });
    })
]

const postLogin = [
    validator.validateLogin,
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('login', {
                title: 'Log In',
                errors: errors.array(),
            });
        }
        next();
    },
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if(err)
                return next(err);
            if(!user)
                return res.status(400).render('login', {
                    title: 'Log In',
                    errors: [{ msg: info.message }],
                });

            req.login(user, (err) => {
                if(err)
                    return next(err);
                return res.redirect(`/${req.user.id}/home`);
            });
        })(req, res, next);
    }
]

const postAddFile = [
    upload.single('file'),
    validator.validateFile,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const size = req.file.size;
        const folderId = req.body.folderId;

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const folders = await db.getUserFolders(req.user.id);
            return res.status(400).render('addFile', {
                title: 'Add File',
                folders: folders,
                errors: errors.array(),
            });
        }

        await db.insertFile(name, size, req.file.filename, folderId);
        res.redirect(`/${req.user.id}/home`);
    })
];

const postAddFolder = [
    validator.validateFolder,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const parentFolderId = req.body.parentFolderId;

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const folders = await db.getUserFolders(req.user.id);
            return res.status(400).render('addFolder', {
                title: 'Add Folder',
                folders: folders,
                errors: errors.array(),
            });
        }

        await db.insertFolder(req.user.id, name, parentFolderId);
        res.redirect(`/${req.user.id}/home`);
    })
];

module.exports = {
    getIndexPage,
    getSignupPage,
    getLoginPage,
    logoutUser,
    getHomePage,
    getAddFileForm,
    getAddFolderForm,
    postSignup,
    postLogin,
    postAddFile,
    postAddFolder,
};