const {Bundle, bundleEvent} = require('./Bundle')
const fs = require('fs')
const EventEmitter = require('events')
let handlerEvent = new EventEmitter()

function BundleHandler(userDataLoc){
    this.bundleCollection = {}
    this.userDataLocation = userDataLoc
    this.loadFromUserData()
}


BundleHandler.prototype.loadFromUserData = function (){

    if(this.userDataLocation !== undefined && this.userDataLocation !== null){
        rawbundleObj = fs.readFileSync(this.userDataLocation)
        if(rawbundleObj !== undefined && rawbundleObj !== null) {
            let bundleJsonObj = JSON.parse(rawbundleObj)
            let bundleLst = bundleJsonObj["bundleObjLst"]
            let cnt = 0
            bundleLst.forEach(bundleObj => {
                this.importBundle(bundleObj)
                cnt+=1
                if(cnt === bundleLst.length){
                    handlerEvent.emit('bundle-load-done')
                }
            });
        }
    } else {
        handlerEvent.emit('bundle-load-done')
        return
    }
}

BundleHandler.prototype.createBundle = function(name, queryList) {
    var bundle = new Bundle(name)
    for (const queryIndex in queryList) {
        bundle.addQuery(queryList[queryIndex]["query"], queryList[queryIndex]["color"], queryList[queryIndex]["qid"])
    }
    this.bundleCollection[name] = bundle

}

BundleHandler.prototype.updateBundle = function(name, queryList) {
    if (this.bundleCollection[name] === undefined) {
        this.createBundle(name, queryList)
    } else {
        this.bundleCollection[name].deleteAllQueries()
        for (const queryIndex in queryList) {
            this.bundleCollection[name].addQuery(queryList[queryIndex]["query"], queryList[queryIndex]["color"], queryList[queryIndex]["qid"])
        }
        
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
}

BundleHandler.prototype.enableBundle = function(bundleName, status) {
    this.bundleCollection[bundleName].enforce(status)

}

BundleHandler.prototype.getBundle = function(bundleName) {
    return this.bundleCollection[bundleName]
}

BundleHandler.prototype.deleteQuery = function(bundleName, qid) {
    this.bundleCollection[bundleName].deleteQuery(qid)
}

BundleHandler.prototype.updateQuery = function(bundleName, qid, queryObj) {
    this.bundleCollection[bundleName].updateQuery(qid, queryObj["query"], queryObj["color"])
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

module.exports = {
    BundleHandler: BundleHandler,
    handlerEvent: handlerEvent
}