const Listing=require('./models/listing.js')
const Review=require('./models/review.js')

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.originalUrl);
    if(!req.isAuthenticated()){
           if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
            
        } else {
            const listingId = req.params.id;
            req.session.redirectUrl = listingId ? `/listings/${listingId}` : "/listings";
        }
        // req.session.redirectUrl=req.originalUrl;  
        
        req.flash("error","You must be logged In");
        return res.redirect("/login");
    }
    next();
}
module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        
    }
    next();
    }

module.exports.isOwner=async(req,res,next)=>{
            let {id}=req.params;
         let listing=await Listing.findById(id);
             if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
    }
 module.exports.isAuthor=async(req,res,next)=>{
            let {reviewId}=req.params;
            let {id}=req.params;
        
            // console.log(id);
         let review=await Review.findById(reviewId);
             if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
    }