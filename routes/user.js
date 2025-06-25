const {Router} = require("express");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const express = require('express')
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Users/dhruv/OneDrive/Desktop/Webdev/nodeJS/expense-tracker/public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + "-" + file.originalname); // preserve extension
  }
});

const upload = multer({ storage: storage })


const router = Router();

// router.get("/", (req,res) => {
//     res.render("user");
// });


router.get("/signup",(req,res) => {
    res.render("signup");
});
router.post("/signup", upload.single("profileImageURL"), async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        await User.create({
            fullName,
            email,
            password, 
            profileImageURL: profileImage
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).send("Error during signup.");
    }
});

router.get("/login",(req,res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        res.cookie("token", token);

        return res.redirect("/");
        
    } catch (error) {
        return res.render("login", {
            error: "Incorrect Email or Password!"
        });
    }
});

router.get("/logout",(req,res) => {
    res.clearCookie("token");
    return res.redirect("/");
});

module.exports = router;