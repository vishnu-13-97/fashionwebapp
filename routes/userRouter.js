const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const passport = require('passport');

router.get('/',userController.loadHomePage);
router.get('/signUp',userController.loadSignUp);
router.post('/signUp',userController.signUp);
router.post('/verifyOtp',userController.verifyOtp);
router.post('/resendOtp',userController.resendOtp)
router.get('/auth/google',passport.authenticate('google',{scope:['profile',"email"]}));
router.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/login',failureMessage: true}),(req,res)=>{
        if (req.user) {
            res.redirect('/');
        } else {
            res.redirect('/login?error=blocked');
        }
    }
);
router.get('/login',userController.loadLogin);
router.post('/login',userController.login);
router.get('/logOut',userController.logOut);
router.get('/pageNotFound',userController.pageNotFound);


module.exports = router;