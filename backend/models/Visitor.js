const mongoose=require('mongoose')

const VisitorSchema=new mongoose.Schema({
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

const Visitor=mongoose.models.Visitor || mongoose.model('Visitor',VisitorSchema);
module.exports=Visitor