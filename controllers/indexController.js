const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const bcrypt = require('bcryptjs');
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
    //const files = await db.getUserFiles(folderId);
    //const folders = await db.getUserFolders(folderId);
    res.render('home', {
        title: 'Home Page',
        //files: files,
        //folders: folders,
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

module.exports = {
    getIndexPage,
    getSignupPage,
    getLoginPage,
    logoutUser,
    getHomePage,
    postSignup,
    postLogin,
};