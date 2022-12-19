const fs = require('fs');

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file);
    });
}

console.log(getDirectories("./storage"));