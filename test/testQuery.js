var Query = require('../lib/Query')


var query = new Query(1, "((Incident02 AND Scenario01) OR Stopped)", "RED")
logStmts = ["Incident02 with Scenario01 when Scenario02 was Stopped", "Incident02 with Scenario03 when Scenario02 was Running", "Incident03 with Scenario03 when Scenario02 was Stopped"]
console.log("QUERY STMT:", query.getQuery())
logStmts.forEach(log => {
    let finStatement = query.filter(log)
    console.log("Act log:", log)
    console.log("filt log:", finStatement)
});
