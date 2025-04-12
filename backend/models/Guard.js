const mongoose=require('mongoose')

const GuardSchema=new mongoose.Schema({
    Name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    PassWord:{
        type:String,
        require:true
    },
    Number:{
        type:String,
        require:true
    },
    Image:{
        type:String,
        require:true
    }
})

const Guard=mongoose.models.Guard ||mongoose.model('Guard',GuardSchema);
module.exports=Guard