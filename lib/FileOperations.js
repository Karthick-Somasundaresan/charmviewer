const es = require('event-stream')
const fs = require('fs')
const EventEmitter = require('events').EventEmitter

const fileEvents = new EventEmitter()


// var logToHTMLCollection = []
function openFileOperation (filename) {
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
                        fileEvents.emit("read-line", line)
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
                        fileEvents.emit("read-complete")
                        console.log("Read file completed")
                    }))

        }
    })
}

// function getFileLineCnt (filename){
//     fs.exists(filename, function(present){
//         if(present){

//         }
//     })
// }

// fileEvents.on('read-line', function(lineObj){
//     logToHTMLCollection.push(lineObj)
// })
// function createHTMLLogFile(){
//     htmlFile = fs.createWriteStream("./tmpLog.html")
//     htmlFile.cork()
//     htmlFile.write("<html><body><table><tbody>")
//     for (let index = 0; index < logToHTMLCollection.length; index++){
//         // insertedRow = fileArea.insertRow(tableSize + index)
//         // linenoCell = insertedRow.insertCell(0)
//         // logCell = insertedRow.insertCell(1)
//         htmlFile.write("<tr>")
//         htmlFile.write("<td>" +logToHTMLCollection[index].lineno + "</td>")
//         htmlFile.write('<td> <p id="p_'+logToHTMLCollection[index].lineno+'">' + logToHTMLCollection[index].log + "</p></td>")
//         htmlFile.write('</tr>')
//         // linenoCell.innerHTML = "<td>" +logToHTMLCollection[index].lineno + "</td>"
//         // logCellHTML = '<td> <p id="p_'+logToHTMLCollection[index].lineno+'">' + logToHTMLCollection[index].log + "</p></td>"
//         // console.log(logCellHTML)
//         // logCell.innerHTML = logCellHTML
//         // logCell.innerHTML = "<td> <p id=p_"+lineObj.lineno+">"+ logToHTMLCollection[index].log + "</td></tr>"

//     }
//     htmlFile.write('</tbody></table></body></html>')
//     htmlFile.uncork()
//     htmlFile.end()
// }
// fileEvents.on('read-complete', function(){
//     createHTMLLogFile()
// })
module.exports = {
    "openFileOperation": openFileOperation,
    "fileEvents": fileEvents
}