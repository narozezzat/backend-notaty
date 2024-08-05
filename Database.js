const mongoose = require('mongoose');
const Note = require('./schemas/note');

class Database {
    constructor() {
        // this.url = "mongodb://localhost:27017/notaty";
        this.url = process.env.MONGODB_URL || "mongodb+srv://narozezzat10:QlasyEHs7jjGdkMr@cluster0.7xemiso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    }

    connect() {
        mongoose.connect(this.url)
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.error('Could not connect to MongoDB', err));
    }

    addNote(note) {
        return new Promise((resolve, reject) => {
            note['createdDate'] = new Date();
            note['updatedDate'] = new Date();
            let newNote = new Note(note);
            newNote
                .save()
                .then(doc => resolve(doc))
                .catch(err => reject(err));
        })
    }

    getNoteById(id) {
        return new Promise((resolve, reject) => {
            Note.findById(id)
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    getAllNotes() {
        return new Promise((resolve, reject) => {
            Note.find()
                .then(data => resolve(data))
                .catch(err => reject(err));
        });

    }

    getNotesByTitle(noteTitle) {
        return new Promise((resolve, reject) => {
            // this is equivalent to /${noteTitle}/i, i is a modifier to make the search case-insensitive
            const query = { title: { $regex: new RegExp(noteTitle, 'i') } };
            Note.find(query)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    deleteNote(noteId) {
        return new Promise((resolve, reject) => {
            Note.findByIdAndDelete(noteId)
                .then((data) => {
                    console.log("deleted document:", data);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

module.exports = Database;
