const express = require('express');
const passport = require('passport');
const router = express.Router();

const commentsController = require('../controllers/comments_contoller');

router.post('/create',passport.checkAuthentication, commentsController.create);

module.exports = router;