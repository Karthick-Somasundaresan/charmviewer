const Query = require("./Query")
const EventEmitter = require("events").EventEmitter
const fs = require("fs")

// var eventQuery = new EventEmitter()
function Bundle (bundleName) {
    this.bundleName = bundleName
    this.queryCollection = {}
    this.enable = false
    this.eventQuery = new EventEmitter()
}

Bundle.prototype.getQueryList = function(){
    return this.queryCollection
}

Bundle.prototype.addQuery = function(query, color, argqid){
    if (argqid === undefined || argqid === null ){

        qid = Object.keys(this.queryCollection).length + 1
    } else {
        qid = argqid
    }
    newQuery = new Query(qid, query, color)
    this.queryCollection[qid] = newQuery
    this.eventQuery.emit("new-query", {"bundlename": this.bundleName, "qid":qid, "query": query, "color": color})
}

// eventQuery.on('new-query', function(){
//     console.log("cosume success of new-query")
// })
Bundle.prototype.deleteQuery = function(delQid){
    // let delQid = null

    // for (const qid in this.queryCollection) {
    //     if (this.queryCollection.hasOwnProperty(qid)) {
    //         if(this.queryCollection[qid] === delquery){
    //             delQid = qid
    //         }
    //     }
    // }
    delete this.queryCollection[delQid]
    this.eventQuery.emit("del-query", {"bundlename": this.bundleName, "qid": delQid})
}

Bundle.prototype.getQueryListSize = function(){
    return Object.keys(this.queryCollection).length
}

Bundle.prototype.updateQuery = function (qid, query, color){
    this.queryCollection[qid].setQuery(query) 
    this.queryCollection[qid].setColor(color)
    this.eventQuery.emit('update-query', {"bundlename": this.bundleName, "qid": query, "color": color})
}

Bundle.prototype.matchLog = function(logStmt, userdata, bookmarked) {

    let logMatched = false
    // let matchedQid = ""
    let matchedQid = []
    for (const qid in this.queryCollection) {
        if (this.queryCollection.hasOwnProperty(qid)) {
            filtLog = this.queryCollection[qid].filter(logStmt)
            if (filtLog !== null && filtLog !== undefined && filtLog !== "") {
                // console.log("logStmt: ", filtLog, " falls under:", this.queryCollection[qid].getQuery())
                logMatched = true
                matchedQid.push(this.bundleName + "_" + qid)
                break;
            }
        }
    }
    if (bookmarked){
        matchedQid.push("Bookmark")
    }
    if (logMatched || bookmarked){
        this.eventQuery.emit('matched-log', {"log": logStmt, "matchedQid": matchedQid, "userdata": userdata})
    }
}

Bundle.prototype.getPreviousQid = function(currentQid) {
    targetQid = -1;
    keysLst = Object.keys(this.queryCollection)
    for(index = 0; index<keysLst.length; index++){
        if (keysLst[index] == currentQid && index !=0){
            targetQid = keysLst[index - 1];
            break;
        }
    }
    return targetQid
}

Bundle.prototype.getNextQid = function(currentQid){
    targetQid = -1;
    keysLst = Object.keys(this.queryCollection)
    for(index = 0; index<keysLst.length; index++){
        if (keysLst[index] == currentQid && index !=keysLst -1){
            targetQid = keysLst[index + 1];
            break;
        }
    }
    return targetQid
}


Bundle.prototype.swapPriority = function(qid, direction) {
    // let tmpQuery = this.queryCollection[qid].getQuery()
    // if (direction === "Up" && qid !== 1){
    //     this.queryCollection[qid].setQuery(this.queryCollection[qid - 1].getQuery())
    //     this.queryCollection[qid - 1].setQuery(tmpQuery)
    // } else if(direction === "Down" && qid !== Object.keys(this.queryCollection).length) {
    //     this.queryCollection[qid].setQuery(this.queryCollection[qid + 1].getQuery())
    //     this.queryCollection[qid + 1].setQuery(tmpQuery)
    // }
    if (direction === "Up"){
        targetQid = this.getPreviousQid(qid)
        if (targetQid !== -1) {
            this.queryCollection["ctmp"] = this.queryCollection[qid]
            this.queryCollection["ttmp"] = this.queryCollection[targetQid]
            this.queryCollection[targetQid] = this.queryCollection["ctmp"]
            this.queryCollection[qid] = this.queryCollection["ttmp"]
            this.queryCollection[targetQid]["qid"] = parseInt(targetQid)
            this.queryCollection[qid]["qid"] = parseInt(qid)
        }
        
    } else if(direction === "Down") {
        targetQid = this.getNextQid(qid)
        if(targetQid !== -1){
            this.queryCollection["ctmp"] = this.queryCollection[qid]
            this.queryCollection["ttmp"] = this.queryCollection[targetQid]
            this.queryCollection[targetQid] = this.queryCollection["ctmp"]
            this.queryCollection[qid] = this.queryCollection["ttmp"]
            this.queryCollection[targetQid]["qid"] = parseInt(targetQid)
            this.queryCollection[qid]["qid"] = parseInt(qid)
        }
    }
    delete this.queryCollection["ctmp"]
    delete this.queryCollection["ttmp"]

}

Bundle.prototype.export = function(){
    let bundleObj = {}
    bundleObj["bundleName"] = this.bundleName
    bundleObj["queryCollection"] = {}
    for (const qid in this.queryCollection) {
        if (this.queryCollection.hasOwnProperty(qid)) {
            const element = this.queryCollection[qid].export();
            bundleObj["queryCollection"][qid] = element
        }
    }
    return bundleObj
}

Bundle.prototype.enforce = function(status) {
    this.enable = status
}

Bundle.prototype.getEnforcement = function() {
    return this.enable
}

Bundle.prototype.importFromFile = function(fileName) {

}

Bundle.prototype.exportToFile = function(fileName){

}

Bundle.prototype.deleteAllQueries = function() {
    delete this.queryCollection
    this.queryCollection = {}
    this.eventQuery.emit("delete-all", {"bundlename": this.bundleName})
}


module.exports = {
    Bundle: Bundle,
    // bundleEvent: eventQuery
}
// module.exports.Bundle = Bundle
// module.exports.DIRECTION = DIRECTION