const User = require('../models/userSchema');



const userauth = async (req, res, next) => {
    try {
       
        if (!req.session.user) {
            return res.redirect('/login');
        }

      
        const user = await User.findById(req.session.user);
        
        
        if (user && user.isBlocked) {
            return next();
        }


        return res.redirect('/login');
    } catch (error) {
        console.error("Error in userauth middleware:", error);
        res.status(500).send("Internal server error");
    }
};





const adminAuth = async (req, res, next) => {
    try {
        
        if (!req.session.admin) {
            return res.redirect('/admin/login'); 
        }

        const user = await User.findById(req.session.admin);

        if (user && user.isAdmin) {
            return next(); 
        }

       
        return res.redirect('/admin/login');
    } catch (error) {
        console.error("Error in Admin auth Middleware:", error);
        res.status(500).send("Internal server error");
    }
};






module.exports = ({
    userauth,adminAuth
})