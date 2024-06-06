const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../src/models/NotesSchema');
const { body, validationResult } = require('express-validator');

// Fetch all notes
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user._id });            //this will fetch all the notes of the user who is authorized using JWT
        res.json(notes);     //send the notes as res
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Adding notes
router.post('/addnewnotes', [   //again it is having some express-validator
    fetchUser,   //middleware function
    body('title', 'Title must be at least 3 characters long').isLength({ min: 3 }),
    body('description', 'Description must be at least 3 characters long').isLength({ min: 3 }),
    body('tag', 'Tag must be at least 3 characters long').isLength({ min: 3 }),
    body('checked').isBoolean().withMessage('Checked must be a boolean value')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag, completedtill, checked } = req.body;
        const note = new Notes({ title, description, tag, user: req.user._id, completedtill, checked });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Update note
router.put('/updatenote/:id', [
    fetchUser,
    body('title', 'Title must be at least 3 characters long').optional().isLength({ min: 3 }),
    body('description', 'Description must be at least 3 characters long').optional().isLength({ min: 3 }),
    body('tag', 'Tag must be at least 3 characters long').optional().isLength({ min: 3 }),
    body('checked').isBoolean().withMessage('Checked must be a boolean value')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag, completedtill, checked } = req.body;
    const newNote = {};   //create a empty newNote 
    if (title) newNote.title = title;   //add title to that newnote
    if (description) newNote.description = description;  //add description to that newnote
    if (tag) newNote.tag = tag;  //add tag to that newnote
    if (completedtill) newNote.completedtill = completedtill;  //add completed to that newnote
    if (checked !== undefined) newNote.checked = checked;  //add checked to that newnote

    try {
        let note = await Notes.findById(req.params.id);  // this will pick the specific note _id and update that
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        console.log(note.user.toString())
        console.log(req.user._id.toString())
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Not allowed" });
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete note
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);   // delete specific note by id 
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not allowed" });
        }

        await Notes.findByIdAndDelete(req.params.id);
        res.json({ success: "Note has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
