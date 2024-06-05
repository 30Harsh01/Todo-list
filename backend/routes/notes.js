const express=require('express')
const router=express.Router();
const fetchUser=require('../middleware/fetchUser')
const notes=require('../src/models/NotesSchema')
const { body, validationResult } = require('express-validator')

router.get('/fetchallnotes',fetchUser,async (req,res)=>{
    const Notes=await notes.find({user:req.user.id})
    res.json(Notes)
})

// adding notes
router.post('/addnewnotes',fetchUser,[
    body('title','message-Enter a valid title').isLength({min:5}),
    body('description').isLength({min:5})
],async (req,res)=>{
    const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        try {
            const {title,description,tag}=req.body
            const note= new notes({title,description,tag,user:req.user.id})
            const savedNotes=await note.save()
            res.json(savedNotes)
        } catch (error) {
            res.status(500).send('internal server error')
        }
})

//update note
router.put('/updatenote/:id',fetchUser,async (req,res)=>{
    try {    
        let {title,description,tag}=req.body;
        //create a new note
        const newNote={};
        if(title){newNote.title=title}
        if(tag){newNote.tag=tag}
        if(description){newNote.description=description}
    
        //
    
        let note=await notes.findById(req.params.id)
        // console.log(note)
        if(!note){return res.status(404).send("Not found")}
    
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }
    
        note=await notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json({note})
    } catch (error) {
        res.status(500).send("Internal server error")
        // console.log(error)
    }
})



//delete 
router.delete('/deletenote/:id',fetchUser,async (req,res)=>{
    try {    
        let {title,description,tag}=req.body;
        //create a new note
        const newNote={};
        if(title){newNote.title=title}
        if(tag){newNote.tag=tag}
        if(description){newNote.description=description}
        let note=await notes.findById(req.params.id)
        // console.log(note)
        if(!note){return res.status(404).send("Not found")}
    
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }
    
        note=await notes.findByIdAndDelete(req.params.id)
        res.json({"success":"Note has been deleted"})
    } catch (error) {
        res.status(500).send('internal server error')
        // console.log(error)
    }
})

module.exports=router