const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
let mongoURL='mongodb://127.0.0.1:27017/hoomies'
async function main(){
    mongoose.connect(mongoURL);
}
main().then(()=>{
    console.log("connected to db")
}).catch(err=>{
    console.log(err);
})

const initDB=async()=>{
    await Listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj,owner:'688f827d8076c2f087b2592d'}));
    await Listing.insertMany(initdata.data);
    console.log("data initialized");
}
initDB();