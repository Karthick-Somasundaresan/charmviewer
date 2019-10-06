var fs = require('fs')
var es = require('event-stream')
var readline = require('readline')
var eventemit = require('event')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter filename:', function(filename){
      console.log("Entered fileName:", filename)
      fs.exists(filename, function(present){
          if (present){
              console.log("Given filename is present")
              var s = fs.createReadStream(filename)
                        .pipe(es.split())
                        .pipe(es.mapSync(function(line){
                        }))
                        .on('error', function(error){
                            console.log("Error occured while reading")
                        })
                        .on('end', function(){
                            console.log("Read file Ended")
                        })
          } else {
              console.log("File is not present")
          }
      })
      rl.close()
  });
