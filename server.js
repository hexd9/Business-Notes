const express = require("express");
const path = require("path");
const { readFile, writeFile } = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// Import middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// HTML GET Routes

// GET /notes route
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET /index.html routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET /api routes
app.get("/api/notes", (req, res) => {
  readFile("db/db.json").then((data) => {
    res.send(data);
  });
});

// POST /api/notes route
app.post("/api/notes", (req, res) => {
  // the req.body has the new information that the user types
  const newNote = req.body;
  //   newNote ID is part npm uuid package
  newNote.id = uuidv4();

  //   Reading json data
  readFile("db/db.json").then((data) => {
    // convert from json to jscript
    const parseData = JSON.parse(data);
    //
    parseData.push(newNote);
    writeFile("db/db.json", JSON.stringify(parseData)).then(() => {
      res.json(parseData);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  readFile("db/db.json").then((data) => {
    const parsedData = JSON.parse(data);
    const updatedData = parsedData.filter((note) => note.id !== noteId);
    // Return a success status code (204: No Content) if the deletion is successful
    writeFile("db/db.json", JSON.stringify(updatedData)).then(() => {
      res.sendStatus(204);
    });
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

/* Getting Started
The application should have a db.json file on the back end that will be used to store and retrieve notes using the fs module.

The following HTML routes should be created:
GET /notes should return the notes.html file.

GET * should return the index.html file.

The following API routes should be created:

GET /api/notes should read the db.json file and return all saved notes as JSON.

POST /api/notes should receive a new note to save on the request body, add it to the db.json file, 
and then return the new note to the client. You'll need to find a way to give each note a unique id 
when it's saved (look into npm packages that could do this for you). */
