const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const dbPath = __dirname + '/db/db.json';

const readNotesFromDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return [];
  }
};

const saveNotesToDb = (notes) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(notes));
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
};

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = readNotesFromDb();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  const notes = readNotesFromDb();
  notes.push(newNote);
  saveNotesToDb(notes);

  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  let notes = readNotesFromDb();
  notes = notes.filter((note) => note.id !== id);
  saveNotesToDb(notes);

  res.sendStatus(200);
});

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
