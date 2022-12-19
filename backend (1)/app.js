const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
let app = express();
const port = 9000;
let fileNames = [];

app.use(cors());

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("req.params.folderName : ", req.params.folderName);
        const path = '../storage/' + req.params.folderName;
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

let upload = multer({
    storage: storage
})

function getDirectories(path) {
    try {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file);
        });
    } catch (err) {
        console.log(err);
        return [];
    }

}


app.post('/upload/:folderName', upload.single("file"), (req, res) => {

    console.log("req.file : ", req.file)
    res.sendStatus(200).send(req.file);
});

app.get("/download/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    const file = path.join(__dirname, '../storage/', fileName);
    res.download(file);
});

app.get("/getAllFiles/:folderName", (req, res) => {
    let folderName = req.params.folderName;
    res.send(getDirectories("../storage/" + folderName));
})

app.listen(port, () => console.log("listening on port ", port));