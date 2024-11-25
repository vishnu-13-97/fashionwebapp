const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController')




router.get('/',userController.loadHomePage);
router.get('/signUp',userController.loadSignUp)
router.post('/signUp',userController.signUp)
router.get('/pageNotFound',userController.pageNotFound);


module.exports = router;