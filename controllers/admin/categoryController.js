const Category = require('../../models/categorySchema');


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
    res.redirect("/pageError")
    
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
    res.redirect("/pageError");
    }
}






module.exports=({
    categoryInfo,
    addCategory
})