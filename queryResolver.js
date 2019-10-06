/*
((A AND B) NOT C)
{"left":{"left":{"left":{"field":"<implicit>","fieldLocation":null,"term":"DHPK","quoted":false,"regex":false,"termLocation":{"start":{"offset":2,"line":1,"column":3},"end":{"offset":7,"line":1,"column":8}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"field":"<implicit>","fieldLocation":null,"term":"CanConsumeData","quoted":false,"regex":false,"termLocation":{"start":{"offset":11,"line":1,"column":12},"end":{"offset":25,"line":1,"column":26}},"similarity":null,"boost":null,"prefix":null},"parenthesized":true},"operator":"NOT","right":{"field":"<implicit>","fieldLocation":null,"term":"Error in getting the status.","quoted":true,"regex":false,"termLocation":{"start":{"offset":31,"line":1,"column":32},"end":{"offset":61,"line":1,"column":62}},"proximity":null,"boost":null,"prefix":null},"parenthesized":true}}
*/

//var luceneJson = {"left":{"left":{"left":{"field":"<implicit>","fieldLocation":null,"term":"DHPK","quoted":false,"regex":false,"termLocation":{"start":{"offset":2,"line":1,"column":3},"end":{"offset":7,"line":1,"column":8}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"field":"<implicit>","fieldLocation":null,"term":"CanConsumeData","quoted":false,"regex":false,"termLocation":{"start":{"offset":11,"line":1,"column":12},"end":{"offset":25,"line":1,"column":26}},"similarity":null,"boost":null,"prefix":null},"parenthesized":true},"operator":"NOT","right":{"field":"<implicit>","fieldLocation":null,"term":"Error in getting the status.","quoted":true,"regex":false,"termLocation":{"start":{"offset":31,"line":1,"column":32},"end":{"offset":61,"line":1,"column":62}},"proximity":null,"boost":null,"prefix":null},"parenthesized":true}}
/*
(A AND B)
{"left":{"left":{"field":"<implicit>","fieldLocation":null,"term":"DHPK","quoted":false,"regex":false,"termLocation":{"start":{"offset":2,"line":1,"column":3},"end":{"offset":7,"line":1,"column":8}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"field":"<implicit>","fieldLocation":null,"term":"CanConsumeData","quoted":false,"regex":false,"termLocation":{"start":{"offset":11,"line":1,"column":12},"end":{"offset":25,"line":1,"column":26}},"similarity":null,"boost":null,"prefix":null},"parenthesized":true}}
*/

// var luceneJson = {"left":{"left":{"field":"<implicit>","fieldLocation":null,"term":"DHPK","quoted":false,"regex":false,"termLocation":{"start":{"offset":2,"line":1,"column":3},"end":{"offset":7,"line":1,"column":8}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"field":"<implicit>","fieldLocation":null,"term":"CanConsumeData","quoted":false,"regex":false,"termLocation":{"start":{"offset":11,"line":1,"column":12},"end":{"offset":25,"line":1,"column":26}},"similarity":null,"boost":null,"prefix":null},"parenthesized":true}}
/*
A AND B
{"left":{"field":"<implicit>","fieldLocation":null,"term":"DHPK","quoted":false,"regex":false,"termLocation":{"start":{"offset":0,"line":1,"column":1},"end":{"offset":5,"line":1,"column":6}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"field":"<implicit>","fieldLocation":null,"term":"CanConsumeData","quoted":false,"regex":false,"termLocation":{"start":{"offset":9,"line":1,"column":10},"end":{"offset":23,"line":1,"column":24}},"similarity":null,"boost":null,"prefix":null}}
*/

// var luceneJson = {"left":{"field":"<implicit>","fieldLocation":null,"term":"DHPK","quoted":false,"regex":false,"termLocation":{"start":{"offset":0,"line":1,"column":1},"end":{"offset":5,"line":1,"column":6}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"field":"<implicit>","fieldLocation":null,"term":"CanConsumeData","quoted":false,"regex":false,"termLocation":{"start":{"offset":9,"line":1,"column":10},"end":{"offset":23,"line":1,"column":24}},"similarity":null,"boost":null,"prefix":null}}

/*
DHPK AND CanConsumeData AND "Error in getting the status"
{"left":{"left":{"field":"<implicit>","fieldLocation":null,"term":"DHPK","quoted":false,"regex":false,"termLocation":{"start":{"offset":1,"line":1,"column":2},"end":{"offset":6,"line":1,"column":7}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"left":{"field":"<implicit>","fieldLocation":null,"term":"CanConsumeData","quoted":false,"regex":false,"termLocation":{"start":{"offset":10,"line":1,"column":11},"end":{"offset":25,"line":1,"column":26}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"field":"<implicit>","fieldLocation":null,"term":"Error in getting the status","quoted":true,"regex":false,"termLocation":{"start":{"offset":29,"line":1,"column":30},"end":{"offset":58,"line":1,"column":59}},"proximity":null,"boost":null,"prefix":null}},"parenthesized":true}}
*/
const lucene = require('lucene');
const readline = require('readline')
const async = require('async')

const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
})

quitLoop = "no"

function evalExpression(expJson, logLine) {
    var rlogLine = ""
    var llogLine = ""
    if (expJson["right"] === undefined && expJson["left"] === undefined && 
        expJson["operator"] === undefined && expJson["term"] !== null && expJson["term"] !== undefined){
        res = ""
        if(logLine.search(expJson["term"]) != -1) {
            res = logLine
        } else {
            res = ""
        }
        // console.log("Search Term:", expJson["term"])
        // console.log("res:", res)
        return res
    }
    if (expJson["right"] !== undefined && expJson["right"] != null) {
        rlogLine = evalExpression(expJson["right"], logLine)
    } 
    if (expJson["left"] !== undefined && expJson["left"] != null) {
        llogLine = evalExpression(expJson["left"], logLine)
    } 
    result = ""
    if (expJson["operator"] !== undefined && expJson["operator"] != null) {
        switch (expJson["operator"]) {
            case "AND":

                if (rlogLine.length > 0 && llogLine.length > 0) {
                    result = logLine
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
                    result = logLine
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
                        result = logLine
                    }
                } else { // binary flow

                    if (llogLine.length === 0 ){
                        result = ""
                    } else {
                        if (rlogLine.length > 0) {
                            result = ""
                        } else {
                            result = logLine
                        }

                    }
                }
                
                break
                // console.log("NOT R Log: ", rlogLine)
                // console.log("NOT Result: ", result)
 
            default:
                // result = logLine
                break;
        }
    } else {
        if (expJson["start"] !== undefined && expJson["start"] !== null){
            if (expJson["start"] === "NOT") {
                result = llogLine.length > 0 ? "":logLine
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
// logline1 = "<30>: : cisco-stb: APTDAEMON[828] 2019-09-25T08:27:05.798-04:00 [DHPK:GetDecoderStatus:1562] - [bool media::RDKGstAVDecoder::GetDecoderStatus(media::PayloadType, media::RDKGstAVDecoder::DecoderStatus_t*) ] returning FAILURE since audio decoder element is NULL,deviceId=204879234 "
// logline2 = "<30>: : cisco-stb: APTDAEMON[828] 2019-09-25T08:27:05.794-04:00 [DHPK:CanConsumeData:590] - [bool media::RDKGstAVDecoder::CanConsumeData(media::PayloadType, uint32_t, uint64_t) ] type:1 difference between incoming pts(295) and last decoded pts(0): diff(295),deviceId=204879234 "
// logline3 = "<30>: : cisco-stb: APTDAEMON[828] 2019-09-25T08:27:05.827-04:00 [DHPK:CanConsumeData:579] - [bool media::RDKGstAVDecoder::CanConsumeData(media::PayloadType, uint32_t, uint64_t) ] Error in getting the status.,deviceId=204879234 "

logLine1= "Incident1 with scenario01 when scenario02 was running"
logLine2= "Incident1 with scenario01 when scenario02 was stopped"
logLine3= "Incident2 with scenario01 when scenario02 was stopped"
logLine4= "Incident2 with scenario03 when scenario02 was stopped"
logLine5= "Incident2 with scenario03 when scenario02 was running"


logArray = [logLine1, logLine2, logLine3, logLine4, logLine5]
    

// var luceneJson = {"left":{"left":{"left":{"field":"<implicit>","fieldLocation":null,"term":"Incident1","quoted":false,"regex":false,"termLocation":{"start":{"offset":2,"line":1,"column":3},"end":{"offset":12,"line":1,"column":13}},"similarity":null,"boost":null,"prefix":null},"operator":"AND","right":{"field":"<implicit>","fieldLocation":null,"term":"scenario01","quoted":false,"regex":false,"termLocation":{"start":{"offset":16,"line":1,"column":17},"end":{"offset":26,"line":1,"column":27}},"similarity":null,"boost":null,"prefix":null},"parenthesized":true},"operator":"NOT","right":{"field":"<implicit>","fieldLocation":null,"term":"running","quoted":false,"regex":false,"termLocation":{"start":{"offset":32,"line":1,"column":33},"end":{"offset":39,"line":1,"column":40}},"similarity":null,"boost":null,"prefix":null},"parenthesized":true}}
var luceneJson = {}

// for (var i = 0; i < logArray.length; i++) {
//     console.log("############################ iter: ", i, " ###########################")
//     console.log("LogLine:", logArray[i])
//     console.log("Final Result: ", evalExpression(luceneJson, logArray[i]))
//     console.log("############################ iter: ", i, " ###########################")
// }
async.whilst(
    function test(cb) { cb(null, quitLoop === "no"); },
    function iter(callback) {
        for (var i = 0; i < logArray.length; i++) {
            console.log("LogLine:", logArray[i])
        }
        rl.question("query>", function(answer){
                    if (answer === "exit") {
                        quitLoop = "yes"
                        callback(null, quitLoop)
                    } else {
                        luceneJson = lucene.parse(answer)
                        // console.log(JSON.stringify(luceneJson))
                        for (var i = 0; i < logArray.length; i++) {
                            console.log("############################ iter: ", i, " ###########################")
                            // console.log("LogLine:", logArray[i])
                            console.log("Final Result: ", evalExpression(luceneJson, logArray[i]))
                            console.log("############################ iter: ", i, " ###########################")
                        }
                        callback(null, quitLoop)
                    }
                })
    },
    function (err, n) {
        console.log("Finished")
        rl.close()
        // 5 seconds have passed, n = 5
    }
)