const async = require('async')
var count = 0;
async.whilst(
    function test(cb) { cb(null, count < 5); },
    function iter(callback) {
        count++;
        setTimeout(function() {
            console.log(count)
            callback(null, count);
        }, 1000);
    },
    function (err, n) {
        // 5 seconds have passed, n = 5
    }
);