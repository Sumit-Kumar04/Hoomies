const Listing=require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { search, country, category } = req.query;
  let query = {};

  if (search && search.trim() !== '') {
    const regex = new RegExp(search, 'i');
    query.title = regex;
  }

  if (country && country.trim() !== '') {
    query.country = new RegExp(country, 'i');  // Case-insensitive match
  }

  if (category && category.trim() !== '') {
    query.category = category;
  }

  const allListings = await Listing.find(query);
  res.render("listings/index.ejs", { allListings, search, country, category });
};
module.exports.newForm=(req,res)=>{
    
    res.render("listings/new.ejs");
    
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
   const listing= await Listing.findById(id).populate(
    {path:'reviews',
        populate:({path:'author'})}
    ).populate("owner");
   if(!listing){
     req.flash("error","Listing you requested does not exist!");
     res.redirect("/listings");
   }
   else{
    res.render("listings/show.ejs",{listing});
   }
   console.log(listing);
}
module.exports.createListing=async(req,res,next)=>{
    // let {title,description,image,price,country,location}=req.body;
    // try{
    // const newlisting=new Listing(req.body.listing);
    //  await newlisting.save();
     
    //  res.redirect("/listings");
    // }
    // catch(err){
    //     next(err);
    // }
    // if(!req.body.listing){
    //     throw new ExpressError(404,"Send valid data ")
    // }
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    
    // if(!newlisting.description){
    //     throw new ExpressError(404,"Description is missing");
    // }
    // if(!newlisting.title){
    //     throw new ExpressError(404,"title  is missing");
    // } 
    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit:1
})
  .send()
  
  
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={filename,url};
    newlisting.geometry=response.body.features[0].geometry;
    await newlisting.save();
     req.flash("success","New Listing Created")
      res.redirect("/listings");
   
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
     req.flash("error","Listing you requested does not exist!");
     res.redirect("/listings");
   }else{
    console.log(listing);
    let originalListingUrl=listing.image.url;
    originalListingUrl=originalListingUrl.replace('/uploads','/uploads/w_250/');
    res.render("listings/edit.ejs",{listing,originalListingUrl});
   }
}

module.exports.updateListing=async(req,res)=>{
    
    let {id}=req.params;
     if(!req.body.listing){
        throw new ExpressError(404,"Send valid data ")
    }
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={filename,url};
    listing.save();
    }
     req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{

    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted")
    res.redirect("/listings");

}