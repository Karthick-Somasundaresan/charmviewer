const util = require('util')
const lucene = require('lucene')

function Query(qid, query, color){
    this.query = query
    this.qid = qid
    this.lucQuery = lucene.parse(query)
    this.color = color
}

Query.prototype.getQuery = function() {
    return this.query
}

Query.prototype.getColor = function() {
    return this.color
}

Query.prototype.getQid = function(){
    return this.qid
}

Query.prototype.setQuery = function(query) {
    this.query = query
}

Query.prototype.setColor = function(color) {
    this.color = color
}

Query.prototype.qid = function(qid) {
    this.qid = qid
}

Query.prototype.filter = function(logline){
    return evalExpression(this.lucQuery, logline)
}

function evalExpression (expJson, logStmt) {
    var rlogLine = ""
    var llogLine = ""
    if (expJson["right"] === undefined && expJson["left"] === undefined && 
        expJson["operator"] === undefined && expJson["term"] !== null && expJson["term"] !== undefined){
        res = ""
        if(logStmt.search(expJson["term"]) != -1) {
            res = logStmt
        } else {
            res = ""
        }
        // console.log("Search Term:", expJson["term"])
        // console.log("res:", res)
        return res
    }
    if (expJson["right"] !== undefined && expJson["right"] != null) {
        rlogLine = evalExpression(expJson["right"], logStmt)
    } 
    if (expJson["left"] !== undefined && expJson["left"] != null) {
        llogLine = evalExpression(expJson["left"], logStmt)
    } 
    result = ""
    if (expJson["operator"] !== undefined && expJson["operator"] != null) {
        switch (expJson["operator"]) {
            case "AND":

                if (rlogLine.length > 0 && llogLine.length > 0) {
                    result = logStmt
                } else {
                    result = ""
                }
                // console.log("R TERM:", expJson["right"]["term"])
                // console.log("L TERM:", expJson["left"]["term"])
                // console.log("AND R Log: ", rlogLine)
                // console.log("AND L Log: ", llogLine)
                // console.log("AND Result: ", result)
                break;
            case "OR":
                if (rlogLine.length > 0 || llogLine.length > 0) {
                    result = logStmt
                }
                // console.log("OR R Log: ", rlogLine)
                // console.log("OR L Log: ", llogLine)
                // console.log("OR Result: ", result)
                break
            case "NOT":
                if (expJson["left"] === undefined){ // unary flow
                    if (rlogLine.length > 0) {
                        result = ""
                    } else {
                        result = logStmt
                    }
                } else { // binary flow

                    if (llogLine.length === 0 ){
                        result = ""
                    } else {
                        if (rlogLine.length > 0) {
                            result = ""
                        } else {
                            result = logStmt
                        }

                    }
                }
                
                break
                // console.log("NOT R Log: ", rlogLine)
                // console.log("NOT Result: ", result)
 
            default:
                // result = logStmt
                break;
        }
    } else {
        if (expJson["start"] !== undefined && expJson["start"] !== null){
            if (expJson["start"] === "NOT") {
                result = llogLine.length > 0 ? "":logStmt
            } else {
                result = llogLine.length > 0 ? llogLine: ""
            }
        } else {
            result = llogLine.length > 0 ? llogLine: ""
        }
    }
    // console.log("Final result:", result)
    return result
}

Query.prototype.export = function() {
    var queryObj = {"qid": this.qid, "query": this.query, "color": this.color}
    return queryObj
}

module.exports = Query