const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    user: { // foreign key
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData',
        required: true // Ensure that every note is associated with a user
    },
    title: {
        type: String,
        required: true,
        minlength: 5 // minimum length must be 5
    },
    description: {
        type: String,
        required: true,
        minlength: 5 // minimum length must be 5
    },
    tag: {
        type: String,
        default: "General" // Default value is "General" if not provided
    },
    completedtill: {
        type: String,
        default: "" // Default to an empty string if not provided also this will be provided as date from frontend
    },
    checked: {
        type: Boolean,
        default: false // Default value is false if not provided
    },
    date: {
        type: Date,
        default: Date.now // Default to the current date if not provided
    }
});

const NotesData = mongoose.model("NotesData", NotesSchema);
module.exports = NotesData;
