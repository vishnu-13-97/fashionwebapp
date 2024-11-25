const user = require('../../models/userSchema')

const loadHomePage = async (req,res)=>{
    try {
        return res.render('home');
    } catch (error) {
      console.log("Home Page not found");
        res.status(500).send('server error');
        }
}
const loadSignUp = async (req,res)=>{
    try {
        return res.render('signup');
    } catch (error) {
        console.log('Home page not rendered');
        res.status(500).send('Server Error');
        
    }
}

const signUp = async(req,res)=>{
    const {name,email,phone,password}=req.body;
    try {
        const newUser = new user({name,email,phone,password});
        console.log(newUser);
        await newUser.save();

        return res.redirect('/')
        
        



    } catch (error) {
        console.log("server error",error);
        res.status(404).send('db error')
        
        
    }
}












const pageNotFound = async(req,res)=>{
    try {
        
        return res.render('page-404')
    } catch (error) {
        res.redirect('/pageNotFound')
    }
}












module.exports={
    loadHomePage,
    pageNotFound,
    loadSignUp,
    signUp
}