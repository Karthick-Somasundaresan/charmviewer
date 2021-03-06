const {Bundle} = require('../lib/Bundle')
var fs = require('fs')
var es = require('event-stream')
var EventEmitter = require('events')
var readlineEmitter = new EventEmitter()


let myBundle = new Bundle("TestBundle1")
myBundle.addQuery('(("Incident01" AND "with Scenario02") AND "when Scenario03")', "GREEN")
myBundle.addQuery("((Incident01 AND Scenario03) AND Scenario02)", "Blue")
// myBundle.addQuery("((Incident02 AND Scenario03) OR Stopped)", "RED")
// myBundle.addQuery("((Stopped AND Scenario03) OR Incident03)", "GREEN")
myBundle.addQuery("((Scenario01 AND Running) AND (Incident02 OR Incident01))", "PURPLE")
myBundle.addQuery("((Incident02 AND Scenario01) AND Scenario02)", "GREEN")
// myBundle.addQuery("((Incident03 AND Scenario01) AND Scenario03)", "GREEN")
console.log("queryList size:", myBundle.getQueryListSize())
console.log("Query List:")
queryObj = myBundle.getQueryList()
Object.keys(queryObj).forEach(element => {
    console.log(queryObj[element].query)
});
console.log("Moving Up")
myBundle.swapPriority(4, "Up")
queryObj = myBundle.getQueryList()
Object.keys(queryObj).forEach(element => {
    console.log(queryObj[element].query)
});
console.log("Moving Up")
myBundle.deleteQuery(2)
myBundle.swapPriority(3, "Up")
queryObj = myBundle.getQueryList()
Object.keys(queryObj).forEach(element => {
    console.log(queryObj[element].query)
});
console.log("Moving Up")
myBundle.swapPriority(1, "Up")
queryObj = myBundle.getQueryList()
Object.keys(queryObj).forEach(element => {
    console.log(queryObj[element].query)
});
console.log("Moving Down")
myBundle.swapPriority(1, "Down")
queryObj = myBundle.getQueryList()
Object.keys(queryObj).forEach(element => {
    console.log(queryObj[element].query)
});
console.log("Bundle Export: ", myBundle.export())
var s = fs.createReadStream("test/testfile.log")
                        .pipe(es.split())
                        .pipe(es.mapSync(function(line){
                            readlineEmitter.emit('avail-line', line)
                        }))
                        .on('error', function(error){
                            console.log("Error occured while reading")
                        })
                        .on('end', function(){
                            console.log("Read file Ended")
                        })


readlineEmitter.on('avail-line', function(readLine){
    // console.log("Read line: ", readLine)
    myBundle.matchLog(readLine)

})