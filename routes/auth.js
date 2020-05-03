const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const User = require('../models/user');
const authController = require('../controllers/auth');


const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup',[
    body('username')
    .isString().notEmpty()
    .isLength({min: 3})
    .withMessage('Invalid username'),
    body('email', 'Please enter a valid e-mail!')
    .isEmail().notEmpty()
    .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return User.findOne({
          where: {
            email: value
          }
        }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
    .normalizeEmail(),
    body('password', 'Please enter a valid password')
    .isAlphanumeric().notEmpty()
    .isLength({min: 5})
    .trim(),
    body('confirmPassword')
    .custom((value, {req}) => {
        const password = req.body.password;
        if(value !== password) {
          throw new Error('Passwords have to match!');
        }
        return true;
    })
    
], authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;
