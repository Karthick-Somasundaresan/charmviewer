const {BrowserWindow} = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
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

module.exports = { 
    openBundleWindow: openBundleWindow,
    updateBundleWindow: updateBundleWindow
}