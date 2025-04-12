const mongoose=require('mongoose')

const AdminSchema=new mongoose.Schema({
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

const Admin=mongoose.models.Employee ||mongoose.model('Admin',AdminSchema);
module.exports=Admin