const express=require('express');
const router=express.Router({mergeParams:true});
const User=require('../models/user.js');
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware.js');
const userController=require('../controllers/user.js')

//signUp
//signup post
router.route("/signup")
    .get(userController.signUpform)
    .post(wrapAsync(userController.signUpPost));

//login 

//loginPost
router.route("/login")
    .get(userController.loginForm)
    .post(
    savedRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),userController.loginPost
);
    


//logOut
router.get("/logout",userController.logout)
module.exports=router;