const express = require('express');
const cors = require('cors');
const Database = require('./Database');
const bodyParser = require('body-parser');

const db = new Database();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Create POST API to be able to create a new note
app.get('/', (req, res) => {
    let json = { health: true };
    res.send(json);
});

app.get("/test", (req, res) => {
    res.json({ mes: "Hello World!" });
})

app.get('/notes', (req, res) => {
    const { title } = req.query;
    if (title) {
        db.getNotesByTitle(title)
            .then(data => {
                res.send(data);
            })
            .catch(error => {
                res.status(500).send(error);
            });

    } else {
        db.getAllNotes()
            .then(data => {
                res.send(data);
            })
            .catch(error => {
                res.status(500).send(error);
            })
    }
});

app.post('/notes', (req, res) => {
    db.addNote(req.body)
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send(error);
        })
});

app.get('/notes', (req, res) => {
    db.getAllNotes()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send(err);
        });
})

app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.getNoteById(id)
        .then(data => {
            if (!data) {
                res.status(404).send(`Note with id ${id} doesn't exist`);
            } else {
                res.send(data);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        })
});

app.put('/notes', (req, res) => {
    db.updateNote(req.body)
        .then(data => {
            if (!data) {
                res.status(404).send(`Note doesn't exist`);
            } else {
                res.send(data);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.deleteNote(id)
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send(error);
        })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    db.connect();
});