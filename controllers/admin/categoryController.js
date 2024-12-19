const Category = require('../../models/categorySchema');
const Product = require('../../models/productSchema')
const mongoose = require('mongoose');
const categoryInfo = async (req,res)=>{
   try {
    const page = parseInt(req.query.page) || 1;
    const limit =4;
    const skip=(page-1)*limit

    const categoryData = await Category.find({})
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)

    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories/limit);
    res.render('category',{
        cat:categoryData,
        currentPage:page,
        totalPages:totalPages,
        totalCategories:totalCategories

    })

   } catch (error) {
    console.error(error);
    res.redirect("/admin/pageError")
    
   }
}



const addCategory = async(req,res)=>{
 try {
    const {name,description}=req.body;
    
    const existingCategory = await Category.findOne({name:name});
    if(existingCategory){
    return res.status(400).json({ error: "Category Name already exists" });
    }
    const newCategory = new Category({name,description});
    await newCategory.save();
    res.status(201).json({ success: "Category Added Successfully" });
    } catch (error) {
    console.error("Error adding category:", error);
    res.redirect("/admin/pageError");
    }
}



const addCategoryOffer = async (req,res) => {
    try {
     const percentage = parseInt(req.body.percentage);
     const categoryId = req.body.categoryId;
     
     const category = await Category.findById(categoryId);
     if(!category){
        return res.status(404).json({status:false,message:"category not found"});
     }
     const products = await Product.find({category:category._id});
     const hasProductOffer=products.some((product)=>{
        product.productOffer>percentage;
     })
     if(hasProductOffer){
        return res.json({status:false,message:"Products within this category already have offer"})
     }
     await Category.updateOne({_id:categoryId},{$set:{categoryOffer:percentage}});

     for(const product of products){
        product.productOffer=0;
        product.salePrice=product.regularPrice;
        await product.save();
     }
     res.json({status:true});
    } catch (error) {
        res.status(500).json({status:false,message:"Internal server Error"})
        
    }
    
}

const removeCategoryOffer = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ status: false, message: "Invalid categoryId format" });
        }

       
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ status: false, message: "Category not found" });
        }

        const percentage = category.categoryOffer;

       
        const products = await Product.find({ category: category._id });

        if (products.length > 0) {
            for (const product of products) {
        
                product.salePrice += Math.floor(product.regularPrice * (percentage / 100));
                product.productOffer = 0;
                await product.save();
            }
        }

       
        category.categoryOffer = 0;
        await category.save();

       
        res.json({ status: true, message: "Category offer removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server Error" });
    }
};

const getListCategory= async (req,res) => {
    try {
       const {id} = req.query;
        await Category.updateOne({_id:id},{$set:{isListed:false}});
        res.redirect('/admin/category')
        
    } catch (error) {
        res.redirect('/admin/pageError')
        
    }
    
}

const getUnListCategory = async (req,res) => {
    try {
        const {id} = req.query;
        await Category.updateOne({_id:id},{$set:{isListed:true}});
        res.redirect('/admin/category')
    } catch (error) {
        res.redirect('/admin/pageError')
    }
    
}
const getEditCategory =async (req,res) => {
    try {
        const {id} = req.query;
        const category = await Category.findById(id)
      res.render('edit-category',{category:category})
        
    } catch (error) {
        res.redirect('/admin/pageError') 
    }
    
}

const editCategory = async (req,res) => {
    try {
        const id = req.params.id;
    
        
        const {name,description} = req.body;
        
      const name1 = name.trim().toLowerCase();

        const existingCategory = await Category.findOne({name:name1});
        if(existingCategory){
        return res.status(400).json({ error: "Category Name already exists" });
        }
  
      const updateCategory = await Category.findByIdAndUpdate(id,{
        name:name1,
        description
      },{new:true});

      if(updateCategory){
        res.redirect('/admin/category')
      }else{
        res.status(404).json({error:"Internal server error"})
      }

} catch (error) {
        res.redirect('/admin/pageError') 
    }
    
}
module.exports=({
    categoryInfo,
    addCategory,
    addCategoryOffer,
    removeCategoryOffer,
    getListCategory,
    getUnListCategory,
    getEditCategory,
    editCategory
})