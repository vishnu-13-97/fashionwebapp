const Products = require('../../models/productSchema');
const Category = require('../../models/categorySchema');
const Brand =require('../../models/brandSchema');
const User = require('../../models/userSchema');
const sharp =require('sharp');
const fs = require('fs');
const path = require('path');

const getProductsPage = async (req,res) => {
    try {
        res.render('products')
    } catch (error) {
        res.redirect('/admin/pageError');
        }
    
}

const getProductAddPage = async (req,res) => {
    try {
      const category = await Category.find({isListed:true});
      const brand = await Brand.find({isBlocked:false});
      res.render("product-add",{
        cat:category,
        brand:brand
      })  

    } catch (error) {
        res.redirect('/admin/pageError')
        
    }
    
}


module.exports=({
    getProductsPage,
    getProductAddPage
})