const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const {userAuth,adminAuth} = require('../middlewares/auth')
const customerController = require('../controllers/admin/customerController')
const categoryController = require('../controllers/admin/categoryController');
const multer = require('multer');
const storage = require('../helpers/multer');
const uploads = multer({storage:storage});
const brandController = require('../controllers/admin/brandController');
const productController = require('../controllers/admin/productController');


// Admin Management
router.get('/pageError',adminController.pageError);
router.get('/login',adminController.loadLogin);
router.post('/login',adminController.login);
router.get('/logOut',adminController.logOut);
router.get('/',adminAuth,adminController.dashboard);
// Customer Management
router.get('/users',adminAuth,customerController.customerInfo);
router.get('/blockCustomer',adminAuth,customerController.customerBlocked);
router.get('/unBlockCustomer',adminAuth,customerController.customerUnblocked);
// Category Management
router.get('/category',adminAuth,categoryController.categoryInfo);
router.post('/addCategory',adminAuth,categoryController.addCategory);
router.post('/addCategoryOffer',adminAuth,categoryController.addCategoryOffer);
router.post('/removeCategoryOffer',adminAuth,categoryController.removeCategoryOffer);
router.get('/listCategory',adminAuth,categoryController.getListCategory);
router.get('/unListCategory',adminAuth,categoryController.getUnListCategory);
router.get('/editCategory',adminAuth,categoryController.getEditCategory);
router.post('/updateCategory/:id',adminAuth,categoryController.editCategory);
// Brand Management
router.get('/brands',adminAuth,brandController.getBrandPage);
router.post('/addBrand',adminAuth,uploads.single('image'),brandController.addBrand);
router.get('/blockBrand',adminAuth,brandController.brandBlocked);
router.get('/unBlockBrand',adminAuth,brandController.brandUnBlocked)
router.get('/deleteBrand',adminAuth,brandController.brandDeleted)
// Product Management
router.get('/products',adminAuth,productController.getProductsPage)
router.get('/addProducts',adminAuth,productController.getProductAddPage)




module.exports=router;