// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

//Routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    return res.sendFile(path.join(__dirname, '/db/', 'db.json'));
});

app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var note = JSON.parse(fs.readFileSync(path.resolve(__dirname, "db/db.json"), "utf8"));
    var newNote = req.body;

    // Using a RegEx Pattern to remove spaces from newCharacter
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();

    console.log(newNote);
    if(note === ""){
        note = [];
        note.push(newNote);
    }
    else{
       note.push(newNote); 
    }

    var notes = JSON.stringify(note)
    let file = path.join(__dirname, 'db', "/db.json");
    fs.writeFileSync(file, notes)

    res.sendFile(path.join(__dirname, '/db/', 'db.json'));
});

app.delete("/api/notes/:id", function(req, res){
    var id = req.params.id;
    var deleteNotes = JSON.parse(fs.readFileSync(path.resolve(__dirname, "db/db.json"), "utf8"));
    var note = deleteNotes.filter(note =>{
        return deleteNotes.id == id;
        
    })[0];
    console.log(deleteNotes)
    const index = deleteNotes.indexOf(note)
    deleteNotes.splice(index, 1)
    let file = path.join(__dirname, 'db', "/db.json");
    var notes = JSON.stringify(deleteNotes)
    fs.writeFileSync(file, notes)

    res.sendFile(path.join(__dirname, '/db/', 'db.json'));
}) 

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});