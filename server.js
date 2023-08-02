const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading data:", err);
      return res.status(500).json({ error: 'Error reading data.' });
    }

    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (parseErr) {
      console.error("Error parsing data:", parseErr);
      return res.status(500).json({ error: 'Error parsing data.' });
    }
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading data:", err);
      return res.status(500).json({ error: 'Error reading data.' });
    }

    try {
      const notes = JSON.parse(data);
      const newNote = req.body;
      newNote.id = Date.now(); 

      notes.push(newNote);

      fs.writeFile('./db/db.json', JSON.stringify(notes), (writeErr) => {
        if (writeErr) {
          console.error("Error writing data:", writeErr);
          return res.status(500).json({ error: 'Error writing data.' });
        }

        res.json(newNote);
      });
    } catch (parseErr) {
      console.error("Error parsing data:", parseErr);
      return res.status(500).json({ error: 'Error parsing data.' });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading data:", err);
        return res.status(500).json({ error: 'Error reading data.' });
      }

      try {
        const notes = JSON.parse(data);
        const updatedNotes = notes.filter((note) => note.id !== noteId);
  
        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (writeErr) => {
          if (writeErr) {
            console.error("Error writing data:", writeErr);
            return res.status(500).json({ error: 'Error writing data.' });
          }

          res.json({ message: 'Note deleted successfully.' });
        });
      } catch (parseErr) {
        console.error("Error parsing data:", parseErr);
        return res.status(500).json({ error: 'Error parsing data.' });
      }
    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
