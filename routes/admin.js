const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const Article = require('../models/article');

// Admin router url starts with /admin
router.get('/pages/panel', isAuth, adminController.getPanel);

router.get('/pages/articles-panel', isAuth,adminController.getArticlesPanel);

router.get('/main/add-article', isAuth,adminController.getAddArticle);

router.get('/main/edit-article/:articleId', isAuth,adminController.getEditArticle);

router.get('/main/add-data/:pageTableSelect', isAuth,adminController.getAddData);

router.get('/main/edit-data/:elementIdPageTableName', isAuth,adminController.getEditData);

router.post('/main/add-article', isAuth,
[
    body('title', 'Invalid title')
    .isString().notEmpty()
    .isLength({min: 3})
    .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return Article.findOne({
          where: {
            title: value
          }
        }).then(tit => {
          if (tit) {
            return Promise.reject(
              'Title exists already, please pick a different one.'
            );
          }
        });
      }),
    body('postedBy', 'Invalid posted by!')
    .isString().notEmpty(),
    body('email', 'Please enter a valid email')
    .isEmail().notEmpty()
    .normalizeEmail(),
    body('category', 'Please enter category')
    .isString().notEmpty(),
    body('readTime', 'Invalid Read Time')
    .isNumeric().notEmpty(),
    body('tags', 'Please enter tags')
    .isString().notEmpty(),
    body('article', 'Please enter article')
    .isLength({min: 10}).notEmpty(),   
    
],
adminController.postAddArticle);

router.post('/main/edit-article', isAuth,
[
    body('title', 'Invalid title')
    .isString().notEmpty()
    .isLength({min: 3}),   
    body('postedBy', 'Invalid posted by!')
    .isString().notEmpty(),
    body('email', 'Please enter a valid email')
    .isEmail().notEmpty()
    .normalizeEmail(),
    body('category', 'Please enter category')
    .isString().notEmpty(),
    body('readTime', 'Invalid Read Time')
    .isNumeric().notEmpty(),
    body('tags', 'Please enter tags')
    .isString().notEmpty(),
    body('article', 'Please enter article')
    .isLength({min: 10}).notEmpty(),   
    
],
adminController.postEditArticle);

router.post('/main/add-data', isAuth,[
  body('type', 'Please select a type!')
  .custom((value, { req }) => {
    if (value === 'default') {
      throw new Error('Please select a type!');
    }
    return true;
  })
  .notEmpty(),
  body('typeOrder', 'Please enter a numeric type order!')
  .notEmpty()
  .isNumeric(),
  body('txt', 'Please enter a text!')
  .notEmpty()
  .isString(),
  body('description', 'Please enter a description!')
  .notEmpty()
  .isString()    
]
,adminController.postAddData);

router.post('/main/edit-data', isAuth,[
  body('type', 'Please select a type!')
  .custom((value, { req }) => {
    if (value === 'default') {
      throw new Error('Please select a type!');
    }
    return true;
  })
  .notEmpty(),
  body('typeOrder', 'Please enter a numeric type order!')
  .notEmpty()
  .isNumeric(),
  body('txt', 'Please enter a text!')
  .notEmpty()
  .isString(),
  body('description', 'Please enter a description!')
  .notEmpty()
  .isString()    
],
adminController.postEditData);

router.delete('/data/:elementIdTableSelect', isAuth,adminController.deleteData);

router.delete('/article/:articleId', isAuth,adminController.deleteArticle);

module.exports = router;