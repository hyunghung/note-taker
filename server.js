const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const dbPath = __dirname + '/db/db.json'; // Path to the db.json file

const readNotesFromDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8'); // Read the content of db.json file
    return JSON.parse(data); // Parse the JSON data to an array of notes
  } catch (err) {
    console.error('Error reading db.json:', err); // Log any errors while reading db.json
    return []; // Return an empty array if there was an error
  }
};

const saveNotesToDb = (notes) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(notes)); // Write the notes array to db.json
  } catch (err) {
    console.error('Error writing to db.json:', err); // Log any errors while writing to db.json
  }
};

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = readNotesFromDb(); // Read the notes from db.json
  res.json(notes); // Send the notes as JSON response
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body; // Get the new note data from the request body
  newNote.id = uuidv4(); // Generate a unique ID for the new note

  const notes = readNotesFromDb(); // Read the existing notes from db.json
  notes.push(newNote); // Add the new note to the notes array
  saveNotesToDb(notes); // Save the updated notes array to db.json

  res.json(newNote); // Send the new note as JSON response
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params; // Get the ID of the note to be deleted from the URL parameter

  let notes = readNotesFromDb(); // Read the existing notes from db.json
  notes = notes.filter((note) => note.id !== id); // Filter out the note with the given ID
  saveNotesToDb(notes); // Save the updated notes array to db.json

  res.sendStatus(200); // Send a success response
});

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html'); // Serve the notes.html file
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Serve the index.html file for all other routes
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
