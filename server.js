const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error reading data.' });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error reading data.' });
    }

    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = Date.now(); 

    notes.push(newNote);

    fs.writeFile('db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error writing data.' });
      }

      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
  
    fs.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error reading data.' });
      }
  
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
  
      fs.writeFile('db.json', JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Error writing data.' });
        }
  
        res.json({ message: 'Note deleted successfully.' });
      });
    });
  });


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
