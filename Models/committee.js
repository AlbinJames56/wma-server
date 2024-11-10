const mongoose=require('mongoose'); 
const committee=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    file:{
        type:String,
    }
}) 
    const committeeMembers=mongoose.model("committee",committee);
    module.exports=committeeMembers;