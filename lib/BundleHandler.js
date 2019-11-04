const Bundle  = require('./Bundle').Bundle
const bundleEvent  = require('./Bundle').bundleEvent
const fs = require('fs')
const EventEmitter = require('events').EventEmitter
var handlerEvent = new EventEmitter()

function BundleHandler(userDataLoc){
    this.bundleCollection = {}
    this.userDataLocation = userDataLoc
    this.savedBundleLocation = userDataLoc + "/savedBundle.json"
    console.log("Saved Bundle Location:", this.savedBundleLocation)
    this.loadFromUserData()
}


function loadJsonFromFile(fileLoc){

    let bundleJsonObj = {}
    if(fs.existsSync(fileLoc)){
        rawbundleObj = fs.readFileSync(fileLoc)
        if(rawbundleObj !== undefined && rawbundleObj !== null) {
            bundleJsonObj = JSON.parse(rawbundleObj)
        }
    }
    return bundleJsonObj;
}

BundleHandler.prototype.loadFromUserData = function (){

    if(this.userDataLocation !== undefined && this.userDataLocation !== null){
        bundleJsonObj = loadJsonFromFile(this.savedBundleLocation)
        console.log("Json from file: ", bundleJsonObj)
        if(bundleJsonObj !== undefined && Object.keys(bundleJsonObj).length > 0) {
            cnt = 0
            Object.keys(bundleJsonObj).forEach(bundleName => {
                this.importBundle(bundleJsonObj[bundleName])
                cnt+=1
                if(cnt === Object.keys(bundleJsonObj).length){
                    handlerEvent.emit('bundle-load-done')
                }
            });
        } else {
            // console.log("emitting bundle-load-done event")
            handlerEvent.emit('bundle-load-done')
            return
        }
    } else {
        // console.log("emitting bundle-load-done event")
        handlerEvent.emit('bundle-load-done')
        return
    }
}

BundleHandler.prototype.updateUserData = function() {
    if (this.userDataLocation !== undefined && this.userDataLocation !== null ){
        let exportObj = {}
        bundleNames = Object.keys(this.bundleCollection)
        for (const bundle in this.bundleCollection) {
            if (this.bundleCollection.hasOwnProperty(bundle)) {
                const bundleObj = this.bundleCollection[bundle];
                exportObj[bundle] = bundleObj.export()
            }
        }
        fs.writeFileSync(this.savedBundleLocation, JSON.stringify(exportObj))
    }
}

BundleHandler.prototype.createBundle = function(name, queryList) {
    var bundle = new Bundle(name)
    for (const queryIndex in queryList) {
        bundle.addQuery(queryList[queryIndex]["query"], queryList[queryIndex]["color"], queryList[queryIndex]["qid"])
    }
    this.bundleCollection[name] = bundle
    this.updateUserData()

}

BundleHandler.prototype.changePriority = function(bundleName, qid, direction){
    this.bundleCollection[bundleName].swapPriority(qid, direction)
}

BundleHandler.prototype.updateBundle = function(name, queryList) {
    if (this.bundleCollection[name] === undefined) {
        this.createBundle(name, queryList)
    } else {
        this.bundleCollection[name].deleteAllQueries()
        for (const queryIndex in queryList) {
            this.bundleCollection[name].addQuery(queryList[queryIndex]["query"], queryList[queryIndex]["color"], queryList[queryIndex]["qid"])
        }
        this.updateUserData()
        
    }
}


BundleHandler.prototype.getAllBundleNames = function() {
    let bundleNameList = Object.keys(this.bundleCollection)
    return bundleNameList
}

BundleHandler.prototype.getAllBundles = function() {
    let bundleList = []
    for (const bundle in this.bundleCollection) {
        if (this.bundleCollection.hasOwnProperty(bundle)) {
            const element = this.bundleCollection[bundle];
            bundleList.push(element.export())
            
        }
    }
    return bundleList
}

BundleHandler.prototype.deleteBundle = function(bundleName) {
    delete this.bundleCollection[bundleName]
    this.updateUserData()
}


/*
* 
bundleObj = {
  bundleName: 'TestBundle1',
  queryCollection: {
    '1': {
      qid: 1,
      query: '((Incident01 AND Scenario03) AND Running)',
      color: 'Blue'
    },
    '2': {
      qid: 2,
      query: '((Stopped AND Scenario03) OR Incident03)',
      color: 'RED'
    },
    '3': {
      qid: 3,
      query: '((Incident02 AND Scenario03) OR Stopped)',
      color: 'GREEN'
    }
  }
}
*/
BundleHandler.prototype.importBundle = function(bundleObj) {
    var impBundle = new Bundle(bundleObj["bundleName"])
    for (const queryObj in bundleObj["queryCollection"]) {
        if (bundleObj["queryCollection"].hasOwnProperty(queryObj)) {
            const element = bundleObj["queryCollection"][queryObj];
            impBundle.addQuery(element["query"], element["color"], element["qid"])
        }
    }
    this.bundleCollection[bundleObj["bundleName"]] = impBundle
    this.updateUserData()
}

BundleHandler.prototype.enableBundle = function(bundleName, status) {
    this.bundleCollection[bundleName].enforce(status)

}

BundleHandler.prototype.getBundle = function(bundleName) {
    return this.bundleCollection[bundleName]
}

BundleHandler.prototype.deleteQuery = function(bundleName, qid) {
    this.bundleCollection[bundleName].deleteQuery(qid)
    this.updateUserData()
}

BundleHandler.prototype.updateQuery = function(bundleName, qid, queryObj) {
    this.bundleCollection[bundleName].updateQuery(qid, queryObj["query"], queryObj["color"])
    this.updateUserData()
}

BundleHandler.prototype.getBundleStatus = function(bundleName) {
    return this.bundleCollection[bundleName].getEnforcement()
}

BundleHandler.prototype.exportBundle = function(bundleName) {
    return this.bundleCollection[bundleName].export()
}

bundleEvent.on('delete-all', function(evtArgs){
    handlerEvent.emit('empty-query', evtArgs)
})

bundleEvent.on('new-query', function(evtArgs){
    // console.log("Inside BundleHHandler new-query")
    handlerEvent.emit('add-query', evtArgs)
})

bundleEvent.on('del-query', eventArgs => {
    handlerEvent.emit('rm-query', eventArgs)
})

bundleEvent.on('update-query', eventArgs => {
    handlerEvent.emit('change-query', eventArgs)
})

bundleEvent.on('matched-log', eventArgs =>{
    handlerEvent.emit('disp-filt-log', eventArgs)
})

// handlerEvent.on('add-query', function(){
//     console.log("Handler event consume test")
// })
// handlerEvent.on('bundle-load-done', function(){
//     console.log("Consume bundle-load-done test pass")
// })
console.log("BundleHandler event: ", {handlerEvent})
module.exports = {
    BundleHandler: BundleHandler,
    handlerEvent: handlerEvent
}