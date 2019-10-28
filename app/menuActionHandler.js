const {BrowserWindow} = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
function openBundleWindow(item, focusedWindow){
    console.log("Received Item: ", {item})
    let modalPath = path.join("file://", __dirname, "./windows/bundleWindow.html")
    console.log("Modal PAth: ", modalPath)
    let win = new BrowserWindow({width: 760, height: 280, 
        show: false,
        // backgroundColor: '#2e2c29',
        webPreferences: {
            nodeIntegration: true
          },
         resizable: false,
        maximizable: false})
    win.webContents.openDevTools()
    win.on('close', ()=>{win = null})
    win.loadURL(modalPath)
    win.on('ready-to-show', function(){
        win.show()
    })
    win.on('did-finish-load', function(){
        console.log("Emitting event Show-Bundle-Window")
        win.webContents.send("Show-Bundle-Window")
    })
}

ipc.on('Show-Bundle-Edit-Window', function(){
    console.log("Received Show-Bundle-Edit-Window")
})

ipc.on('Test-Msg', function(event,args){
    console.log("Received test msg in menuActionHandler.js")
})

module.exports = { 
    openBundleWindow: openBundleWindow
}