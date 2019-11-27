const {BrowserWindow} = require('electron')
const _ = require('lodash')
const path = require('path')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const fileOperation = require('../lib/FileOperations')
let bundleWindow = null
function openBundleWindow(item, focusedWindow){
    console.log("Received Item: ", {item})
    let modalPath = path.join("file://", __dirname, "./windows/bundleWindow.html")
    console.log("Modal PAth: ", modalPath)
    bundleWindow = new BrowserWindow({width: 760, height: 280, 
        show: false,
        // backgroundColor: '#2e2c29',
        webPreferences: {
            nodeIntegration: true
          },
         resizable: false,
        maximizable: false})
    bundleWindow.webContents.openDevTools()
    bundleWindow.on('close', ()=>{bundleWindow = null})
    bundleWindow.loadURL(modalPath)
    bundleWindow.on('ready-to-show', function(){
    // })
    // win.on('did-finish-load', function(){
        console.log("Emitting event Show-Bundle-Window")
        bundleWindow.webContents.send("Show-Bundle-Window")
        bundleWindow.show()
    })
}

ipc.on('Show-Bundle-Edit-Window', function(){
    console.log("Received Show-Bundle-Edit-Window")
})

ipc.on('Test-Msg', function(event,args){
    console.log("Received test msg in menuActionHandler.js")
})


function updateBundleWindow(){
    bundleWindow.webContents.send("Show-Bundle-Window")
}

function postman(eventName, args) {
    bundleWindow.webContents.send(eventName, args)
}

function loadFile(item, focusedWindow){
    dialog.showOpenDialog({properties:["openFile"]}, function(filename){
        console.log("Trying to open: ", filename)
        // focusedWindow.webContents.send("File-To-Load", filename[0])
        fileOperation.openFileOperation(filename[0], focusedWindow)
    })
}

fileOperation.fileEvents.on('read-complete', function(window, filename){
    console.log("File read completely")
    contents = fileOperation.getFileContents(filename)
    window["filename"] = filename
    window.webContents.send("Display-File", {"logs": contents})

})
function selectBundle(menuItem, window, event) {
    console.log("Received MenuItem:", {menuItem})
    console.log("Received Event: ", {event})
    // ipc.send("Enable-Bundle", menuItem.label)
    window.webContents.send("Bundle-Change-Event", menuItem.label)
}

function filterFileWithBundle (filename, bundleObj, callback){
    console.log("Inside Menu-Action-Handler: ", {bundleObj})
    console.log("Received bundleObj query count in menuActionHandler: ", bundleObj.getQueryListSize())
    // dummyResponse = []
    // dummyResponse.push("This is a simple response\n") 
    // dummyResponse.push("This is not a real response\n")
    // dummyResponse.push("This is to test if filtered output is working or not\n")
    fileOperation.filterFileContents(filename, bundleObj,function(filterContents){

        callback({"logs": _.map(filterContents,'log'), "lines": _.map(filterContents, "userdata"), "rules": _.map(filterContents, "matchedQid")})
    })
}

function increaseFontSize(item, focusedWindow){
    console.log("Increase Font size")
    focusedWindow.webContents.send("Increase-Font-Size")
}

function reduceFontSize(item, focusedWindow) {
    console.log("Decrease font size")
    focusedWindow.webContents.send("Decrease-Font-Size")
}

module.exports = { 
    openBundleWindow: openBundleWindow,
    updateBundleWindow: updateBundleWindow,
    selectBundle: selectBundle,
    postman: postman,
    filterFileWithBundle, filterFileWithBundle,
    increaseFontSize, increaseFontSize,
    reduceFontSize, reduceFontSize,
    loadFile: loadFile

}