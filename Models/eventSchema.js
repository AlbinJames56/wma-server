const mongoose=require('mongoose'); 
const eventSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    event_time:{
        type:String,
        require:true
    },
    event_date:{
        type:String,
        require:true
    },
    event_location_url:{
        type:String,
    },
    event_location:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    country:{
        type:String,
        require:true
    },
    tickets:{
        type:Array,
        
    },
    terms:{
        type:String,
        require:true
    },
    eventPoster:{
        type:String,
        require:true
    },
    regOpen:{
        type:String,
        require:true
    } 
})
eventSchema.index({ title: 1, event_time: 1 }, { unique: true });
const events=mongoose.model("events",eventSchema);
module.exports=events;