const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");
const sendMail = require("../../mailer");

const loadHomePage = async (req, res) => {
  try {
    const user = req.session.user;
    const user2 = req.user;

    if (user || user2) {
      const userData = await User.findOne({ _id: user || user2 }).lean();
      return res.render("home", { user: userData });
    }
    res.render("home", { user: null });
  } catch (error) {
    console.log("Home Page not found");
    res.status(500).send("server error");
  }
};

const loadSignUp = async (req, res) => {
  try {
    return res.render("signUp");
  } catch (error) {
    console.log("Home page not rendered");
    res.status(500).send("Server Error");
  }
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signUp = async (req, res) => {
  try {
    const { name, email, phone, password, cPassword } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log("User already exist");
      return res.render("signUp", { message: "Email  Already Exist" });
    }
    if (password !== cPassword) {
      console.log("passwords does not match");
      return res.render("signUp", { message2: "passwords does not match" });
    }
    const otp = generateOtp();
    console.log("Generated OTP:", otp);
    const subject = "Your OTP for Signup";
    const text = `Your OTP is:${otp}`;
    const mail = await sendMail(email, subject, text);
    if (!mail) {
      return res.json("email error");
    }
    req.session.userOtp = otp;
    req.session.userData = { name, email, phone, password };
    console.log("OTP Sent", otp);
    return res.render("verifyOtp");
  } catch (error) {
    console.log("signup error", error);
    res.redirect("/pageNotFound");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log(otp);
    if (otp === req.session.userOtp) {
      const user = req.session.userData;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const saveUserData = new User({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: hashedPassword,
      });
      await saveUserData.save();
      req.session.user = saveUserData._id;

      delete req.session.userOtp;
      delete req.session.userData;
      res.json({ success: true, redirectUrl: "/" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid OTP,Try again" });
    }
  } catch (error) {
    console.error("Error verifying OTP", error);
    res.status(500).json({ success: false, message: "An error Occured" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.session.userData;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });
    }
    const otp = generateOtp();
    req.session.userOtp = otp;
    const subject = "Your OTP for Signup";
    const text = `Your OTP is:${otp}`;
    const mail = await sendMail(email, subject, text);
    if (mail) {
      console.log("Resend otp :", otp);
      return res
        .status(200)
        .json({ success: true, message: "resend succesfully" });
    } else {
      res.status(500).json({ success: false, message: "resend failed" });
    }
  } catch (error) {
    console.error("Internal server error", error);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const loadLogin = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.render("login");
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    res.redirect("/pageNotFound");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ isAdmin: 0, email: email });

    if (!findUser) {
      return res.render("login", { message: "User not found" });
    }
    if (findUser.isBlocked) {
      return res.render("login", { message: "User is Blocked" });
    }
    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if (!passwordMatch) {
      return res.render("login", { message: "Incorrect Password" });
    }

    req.session.user = findUser._id;
    // console.log("user sess",req.session.user);

    res.redirect("/");
  } catch (error) {
    console.error("Login Error", error);
    res.render("login", { message: "Login failed try again later" });
  }
};

const logOut = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.redirect('/pageNotFound');
      }
      return res.redirect('/');
    });
  } catch (error) {
    console.error("Unexpected log out error:", error);
    return res.redirect('/pageNotFound');
  }
};


const pageNotFound = async (req, res) => {
  try {
    return res.render("page-404");
  } catch (error) {
    res.redirect("/pageNotFound");
  }
};

module.exports = {
  loadHomePage,
  pageNotFound,
  loadSignUp,
  signUp,
  verifyOtp,
  resendOtp,
  loadLogin,
  login,
  logOut,
};
