const User = require('../../models/userSchema');
const bcrypt = require('bcrypt');



const loadLogin = async(req,res)=>{
  if(req.session.admin){
    return res.redirect("/admin")
  }
  res.render('admin-login',{message:null})
}


const login = async (req, res) => {
  try {
      const { email, password } = req.body;


      if (!email || !password) {
          return res.render("admin-login", { message: "Email and password are required" });
      }

   
      const admin = await User.findOne({ isAdmin: true, email });
      if (!admin) {
          return res.render("admin-login", { message: "Invalid credentials" });
      }

 
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
          return res.render("admin-login", { message: "Invalid credentials" });
      }

       req.session.admin =admin._id;
      res.redirect("/admin");
  } catch (error) {
      console.error("Error during admin login:", error.message); 
      res.status(500).redirect('/pageNotFound');
  }
};

const dashboard = async (req, res) => {
  try {
      const adminId = req.session.admin; 
      if (!adminId) {
          console.log("No admin found in session.");
          return res.redirect('/admin/login');
      }

    
      const admindata = await User.findOne({ _id: adminId });
      if (!admindata) {
          console.log("Admin data not found for ID:", adminId);
          return res.redirect('/admin/login');
      }

      res.render('dashboard', { admin: admindata });
  } catch (error) {
      console.error("Error rendering admin dashboard:", error.message);
      res.status(500).redirect("/admin/pageError");
  }
};




const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destroy session:", err);
            return res.status(500).send("Failed to log out");
        }
        
        res.redirect('/admin/login')
    });
};

const pageError = (req,res)=>{
    res.render('pageError');
}




module.exports=({
    loadLogin,
    login,
    dashboard,
    pageError,
    logOut
})