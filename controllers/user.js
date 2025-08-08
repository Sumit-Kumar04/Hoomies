const User=require('../models/user')
module.exports.signUpform=(req,res)=>{
    res.render("./users/signUp.ejs");
}
module.exports.signUpPost=async(req,res)=>{
    try{ 
        let {username,email,password}=req.body;  
    const newUser=new User({email,username});
   const registeredUser=await  User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
       return  next(err);
        
    }
    req.flash("success","Welcome to Hoomies");
     res.redirect("/listings")
      
    
   })
  
  
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    

}
module.exports.loginForm=(req,res)=>{
    res.render("./users/login.ejs")
}
module.exports.loginPost=async(req,res)=>{
       
     req.flash("success","Welcome Back to Hoomies!");
     let redirectUrl=res.locals.redirectUrl || "/listings";
     req.session.redirectUrl = null;
     res.redirect(redirectUrl);
    //  console.log(`THIS IS ${res.locals.redirectUrl}`)
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        next(err);
        }
       
        req.flash("success","Logged You Out");
        res.redirect("/listings");
    })
}