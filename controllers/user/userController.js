const User = require('../../models/userSchema')
const bcrypt = require('bcrypt');
const sendMail =require('../../mailer');
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
        return res.render('signUp');
    } catch (error) {
        console.log('Home page not rendered');
        res.status(500).send('Server Error');
        
    }
}
const loadVerifyOtp = async(req,res)=>{
    try {
        return res.render('verifyOtp');
    } catch (error) {
        console.log('verifyOtp page not rendered');
        res.status(500).send('server Error');
        }
}
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
const signUp = async(req,res)=>{
    try {
    const {name,email,phone,password,cPassword}=req.body;
   const userExist =  await User.findOne({email});

   if(userExist){
    console.log("User already exist");
    return res.render('/',{message :"Email  Already Exist"}) 
   }
  if(password !== cPassword){
    console.log("passwords does not match");
    return res.render('signUp',{message2:"passwords does not match"})
} 
const otp =generateOtp();
console.log("Generated OTP:", otp);
const subject= "Your OTP for Signup";
const text = `Your OTP is:${otp}`;

const mail =  await sendMail(email,subject,text);
if(!mail){
    return res.json('email error')
}

req.session.userOtp = otp;
req.session.userData= {name,email,phone,password};



//  const hashedPassword = await bcrypt.hash(password,10);

//         const newUser = new User({name,email,phone,password:hashedPassword});
//         console.log(newUser);
//         await newUser.save();

//         return res.redirect('/')
console.log("OTP Sent",otp);

res.redirect('/verifyOtp')
        
    } catch (error) {
        console.log("signup error",error);
        res.redirect('/pageNotFound')
        
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
    signUp,
    generateOtp,
    loadVerifyOtp
}