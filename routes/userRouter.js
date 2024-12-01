const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController')




router.get('/',userController.loadHomePage);
router.get('/signUp',userController.loadSignUp);
router.post('/signUp',userController.signUp);
router.post('/verifyOtp',userController.verifyOtp);
router.post('/resendOtp',userController.resendOtp)
router.get('/pageNotFound',userController.pageNotFound);


module.exports = router;