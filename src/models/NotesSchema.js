const mongoose=require('mongoose')


const NotesSchema=new mongoose.Schema({
    user:{   //foreign key
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserData',
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:"General"
    },
    completedtill:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const NotesData=new mongoose.model("NotesData",NotesSchema)
module.exports=NotesData