const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// static files.
app.use(express.static(path.join(__dirname, './frontend/build')));
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname,"./frontend/build/index.html"));
})

// fix mongo connection.
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

// mongoose.connect(process.env.DB_CONNECTION_STRING);
// const connection = mongoose.connection;
// connection.once("open", () => {
//     console.log("mongodb database connection successful");
// });

const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Note = mongoose.model("Note", noteSchema);

app.post("/write", (req, res) => {

    const newNote = new Note({
        title: req.body.title,
        content: req.body.content,
    });

        newNote.save();
        // res.redirect("/read");
});

app.get("/read", (req, res) => {

    Note.find({}, (err, result) => {
        if (!result) {
            console.log("no notes found!");
        } else {
            res.json(result);
            // console.log(result);
        }
    });
});

app.delete("/delete/:id", (req, res) => {

    const id = req.params.id;

    // console.log(id);

    Note.findByIdAndRemove(id, (err) => {
        // console.log("deletion successful");
        // res.redirect("/read");
    });
})

// if ( process.env.NODE_ENV == "production"){
    
//     app.use(express.static("frontend/build"));
// }

connectDB().then(() => {
    app.listen(PORT, function () {
        console.log("server is running on port 3000..");
    })
})
