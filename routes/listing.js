const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const  {isLoggedIn}=require("../middleware.js");
const  {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require('../cloudConfig.js')
const upload = multer({storage});



const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{       next();
    }
}

//index rout
//Create rout
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,upload.single('listing[image]'),
        wrapAsync(listingController.createListing));
    

//new 
router.get("/new",isLoggedIn,listingController.newForm);

//show rout
//update
//delete rout
router.route("/:id")
    .get(isLoggedIn,wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//Edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));


module.exports=router;
