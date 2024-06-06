const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../src/models/NotesSchema');
const { body, validationResult } = require('express-validator');

// Fetch all notes
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user._id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Adding notes
router.post('/addnewnotes', [
    fetchUser,
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
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;
    if (completedtill) newNote.completedtill = completedtill;
    if (checked !== undefined) newNote.checked = checked;

    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        if (note.user.toString() !== req.user.id) {
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
        let note = await Notes.findById(req.params.id);
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
