const lucene = require('lucene');
const readline = require('readline')
const async = require('async')

const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
})

quitLoop = "no"
async.whilst(
    function test(cb) { cb(null, quitLoop === "no"); },
    function iter(callback) {
        rl.question("lucene>", function(answer){
                    if (answer === "exit") {
                        quitLoop = "yes"
                        callback(null, quitLoop)
                    } else {
                        let res = lucene.parse(answer)
                        console.log(JSON.stringify(res))
                        callback(null, quitLoop)
                    }
                })
    },
    function (err, n) {
        // console.log("Finished")
        rl.close()
        // 5 seconds have passed, n = 5
    }
);
// async.doUntil(function(callback){
//     console.log("Entry-")
//     rl.question("lucene>", function(answer){
//         if (answer === "exit") {
//             quitLoop = "yes"
//             callback(null, quitLoop)
//         } else {
//             let res = lucene.parse(answer)
//             console.log(res)
//             callback(null, quitLoop)
//         }
//     })
// }, function(){
//     console.log("Inside test", quitLoop)
//     return (quitLoop === "yes")
// }, function (err, n) {    //final result
//     if(err){
//         console.log('Some error occured')
//     }else{
//         console.log('All success')
//     }
// })
// console.log("End of proggramm")

// const ast = lucene.parse('frank OR (engineer AND Doctor)');
// console.log((ast));
