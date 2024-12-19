const Brand = require('../../models/brandSchema');
const Product = require('../../models/productSchema')



const getBrandPage = async (req,res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const limit =4;
    const skip=(page-1)*limit
    
    
    const brandData = await Brand.find({})
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)


    const totalBrands = await Brand.countDocuments();
    const totalPages = Math.ceil(totalBrands/limit);

    res.render("brands",{
        brandData,
        currentPage: page,
        totalPages,})
    
    } catch (error) {
        res.redirect('/pageError')
    }
    
}

const addBrand = async (req,res) => {
    try {

        const brand = req.body.name;
        const image = req.file?.filename;  
        const name = brand.trim().toLowerCase();
        const findBrand = await Brand.findOne({name});

        if (!name || !image) {
            return res.status(400).json({ error: "Brand name and image are required" });
        }else if(findBrand){
            return res.status(400).json({error:"Brand name already exist"});
          }
          

    const newBrand = new Brand({
            brandName:name,
            brandImage:image
        })  

        await newBrand.save();
        res.redirect('/admin/brands');
        
    } catch (error) {
        console.log(error);
        
        res.redirect('/admin/pageError');
        
    }
    
}


const brandBlocked = async (req,res) => {
    try {
        const {id}=req.query;
        await Brand.updateOne({_id:id},{$set:{isBlocked:true}});
        res.redirect('/admin/brands');
        
    } catch (error) {
       res.redirect('/admin/pageError') 
    }
}

const brandUnBlocked = async (req,res) => {
    try {
        const {id}=req.query;
        await Brand.updateOne({_id:id},{$set:{isBlocked:false}});
        res.redirect('/admin/brands');
        
    } catch (error) {
       res.redirect('/admin/pageError') 
    }
}

const brandDeleted = async (req,res) => {
    try {
        
      const {id} = req.query;
      const deletedBrand =await Brand.findOneAndDelete({_id:id});

      if(!deletedBrand){
        res.redirect('/admin/pageError')
      }
      res.redirect('/admin/brands');
      

    } catch (error) {
        res.redirect('/admin/pageError') 
        
    }
    
}

module.exports=({
    getBrandPage,
    addBrand,
    brandBlocked,
    brandUnBlocked,
    brandDeleted
})