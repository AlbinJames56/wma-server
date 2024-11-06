const mongoose=require('mongoose'); 
const eventSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    event_time:{
        type:String,
        required:true
    },
    event_date:{
        type:Date,
        required:true
    },
    event_location_url:{
        type:String,
    },
    event_location:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    tickets:{
        type:Array,
        
    },
    terms:{
        type:String,
        required:true
    },
    eventPoster:{
        type:String,
        required: function () {
            return this.isNew; // Only required if the document is new
          }
    },
    regOpen:{
        type:String,
        required:true
    } 
})
eventSchema.index({ title: 1, event_time: 1 }, { unique: true });
const events=mongoose.model("events",eventSchema);
module.exports=events;