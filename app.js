if(process.env.NODE_ENV !="production"){
require('dotenv').config();

};


const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
let mongoURL='mongodb://127.0.0.1:27017/hoomies';
// let dbUrl=process.env.ATLASDB_URL;


async function main(){
    mongoose.connect(mongoURL)
};
main().then(()=>{
    console.log("Connection successful")
})
.catch(err=>{
    console.log(err);
});

const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));




// app.get("/",(req,res)=>{
//     res.send("I am root");
// });
// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET
//     },
//     touchAfter:24*3600,
// });
// store.on("error",()=>{
//     console.log("ERROR in MONGO SESSION STORE",err);
// });

const sessionOptions={
    // store,
    secret:process.env.SECRET,
    resave:false,
     saveUninitialized:true,
     cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
     }
}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;

    
    // console.log(res.locals.success);
    next();
})
app.get("/demoUser",async(req,res)=>{
    let fakeUser=new User({
        email:"demo@gmail.com",
        username:"demo",
    });
    let newUser=await User.register(fakeUser,"pass");
    res.send(newUser);
})

app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);






// app.get("/listings",async(req,res)=>{
//     let newListing=new Listing({
//         title:"My new home",
//         description:"its sea facing",
//         price:2200,
//         location:"Bombay",
//         country:"India",
//         image:"https://plus.unsplash.com/premium_photo-1697730288131-6684ca63584b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"


//     });
//     await newListing.save();
//     console.log(newListing);
//     res.send("Listed");
// })

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// app.use((err,req,res,next)=>{
//     // res.send("Something Went Wrong");
    
//      const statusCode = err.statusCode || 500;
//     const message = err.message || "Something went wrong";
//     res.status(statusCode).send(`<h1>Error ${statusCode}</h1><p>${message}</p>`);
// })
// app.all("*", (req, res, next) => {
//     console.log("404 route hit"); // for debugging
//     next(new ExpressError(404, "Something went wrong"));
// });
//upper not able to work 
app.use((req, res, next) => {
    // This will run *only* if no route was matched before
    const message="This page does not exist"
    res.status(404).render("error.ejs",{message});
});
app.use((err, req, res, next) => {
   
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    console.log(message);
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(`<h1>Error ${statusCode}</h1><p>${message}</p>`);
});
// app.use((req,res)=>{
//     res.send("Page not found");
// })




app.listen(8080,()=>{
    console.log("app is listening at : ",8080);
})