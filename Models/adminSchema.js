const mongoose=require('mongoose'); 
const adminSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },}) 
    const admin=mongoose.model("admin",adminSchema);
    module.exports=admin;