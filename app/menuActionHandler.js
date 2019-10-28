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
        console.log("Emitting event Show-Bundle-Window")
        win.webContents.send("Show-Bundle-Window")
        win.show()
    })
}

module.exports = { 
    openBundleWindow: openBundleWindow
}