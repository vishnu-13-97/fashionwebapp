const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const {userAuth,adminAuth} = require('../middlewares/auth')
const customerController = require('../controllers/admin/customerController')
const categoryController = require('../controllers/admin/categoryController');


router.get('/pageError',adminController.pageError);
router.get('/login',adminController.loadLogin);
router.post('/login',adminController.login);
router.get('/logOut',adminController.logOut);
router.get('/',adminAuth,adminController.dashboard);
router.get('/users',adminAuth,customerController.customerInfo);
router.get('/blockCustomer',adminAuth,customerController.customerBlocked);
router.get('/unBlockCustomer',adminAuth,customerController.customerUnblocked);
router.get('/category',adminAuth,categoryController.categoryInfo);
router.post('/addCategory',adminAuth,categoryController.addCategory);
router.post('/addCategoryOffer',adminAuth,categoryController.addCategoryOffer);
router.post('/removeCategoryOffer',adminAuth,categoryController.removeCategoryOffer);
router.get('/listCategory',adminAuth,categoryController.getListCategory);
router.get('/unListCategory',adminAuth,categoryController.getUnListCategory)










module.exports=router;