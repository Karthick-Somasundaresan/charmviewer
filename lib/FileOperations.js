const es = require('event-stream')
const fs = require('fs')
const EventEmitter = require('events').EventEmitter

const fileEvents = new EventEmitter()


// var logToHTMLCollection = []
function openFileOperation (filename, window) {
    // let lineno = 0
    fs.exists(filename,function(present){
        if (present) {
            console.log("File Read Started")
            var s = fs.createReadStream(filename)
                    .pipe(es.split())
                    .pipe(es.mapSync(function(line){
                        // lineno++
                        // console.log(lineno)
                        // console.log(line)
                        // fileEvents.emit("read-line", {"lineno": lineno, "log": line})
                        fileEvents.emit("read-line", {"filename": filename, "line": line})
                        // nextLogLine = logArea.insertRow(lineno)
                        // lnoCell = nextLogLine.insertCell(0)
                        // dummyCell = nextLogLine.insertCell(1)
                        // logCell = nextLogLine.insertCell(2)
                        // dummyCell.innerText = lineno
                        // logCell.innerHTML = line
                    })
                    .on('error', function(err){
                        console.log("Error occured in reading file:", err)
                    })
                    .on('end', function(){
                        fileEvents.emit("read-complete", window, filename)
                        console.log("Read file completed")
                    }))

        }
    })
}

var fileContent = {}
fileEvents.on('read-line', function(lineobj){
    if (fileContent[lineobj.filename] === null || fileContent[lineobj.filename] === undefined){
        fileContent[lineobj.filename] = []
    }
    fileContent[lineobj.filename].push(lineobj.line)
})

fileEvents.on('read-complete', function(){

})

function getFileContents(filename) {
    return fileContent[filename];
}

module.exports = {
    "openFileOperation": openFileOperation,
    "getFileContents": getFileContents,
    "fileEvents": fileEvents
}