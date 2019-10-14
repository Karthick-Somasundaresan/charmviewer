const Query = require("./Query")
const EventEmitter = require("events")
const fs = require("fs")

var eventQuery = new EventEmitter()
function Bundle (bundleName) {
    this.bundleName = bundleName
    this.queryCollection = {}
}

Bundle.prototype.getQueryList = function(){
    return this.queryCollection
}

Bundle.prototype.addQuery = function(query, color){
    qid = Object.keys(this.queryCollection).length + 1
    newQuery = new Query(qid, query, color)
    this.queryCollection[qid] = newQuery
    eventQuery.emit("new-query", {"bundlename": this.bundleName, "qid":qid, "query": query, "color": color})
}

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
    eventQuery.emit("del-query", {"bundlename": this.bundleName, "qid": delQid})
}

Bundle.prototype.getQueryListSize = function(){
    return Object.keys(this.queryCollection).length
}

Bundle.prototype.updateQuery = function (qid, query, color){
    this.queryCollection[qid].setQuery(query) 
    this.queryCollection[qid].setColor(color)
    eventQuery.emit('update-query', {"bundlename": this.bundleName, "qid": query, "color": color})
}

Bundle.prototype.matchLog = function(logStmt) {

    for (const qid in this.queryCollection) {
        if (this.queryCollection.hasOwnProperty(qid)) {
            filtLog = this.queryCollection[qid].filter(logStmt)
            if (filtLog !== null && filtLog !== undefined && filtLog !== "") {
                console.log("logStmt: ", filtLog, " falls under:", this.queryCollection[qid].getQuery())
                break;
            }
        }
    }
}

Bundle.prototype.swapPriority = function(qid, direction) {
    let tmpQuery = this.queryCollection[qid].getQuery()
    if (direction === "Up" && qid !== 1){
        this.queryCollection[qid].setQuery(this.queryCollection[qid - 1].getQuery())
        this.queryCollection[qid - 1].setQuery(tmpQuery)
    } else if(direction === "Down" && qid !== Object.keys(this.queryCollection).length) {
        this.queryCollection[qid].setQuery(this.queryCollection[qid + 1].getQuery())
        this.queryCollection[qid + 1].setQuery(tmpQuery)
    }
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


module.exports = Bundle
// module.exports.Bundle = Bundle
// module.exports.DIRECTION = DIRECTION