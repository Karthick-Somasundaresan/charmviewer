const {BrowserWindow} = require('electron')
const path = require('path')

function openBundleWindow(item, focusedWindow){
    console.log("Received Item: ", {item})
    let modalPath = path.join("file://", __dirname, "./windows/bundleWindow.html")
    console.log("Modal PAth: ", modalPath)
    let win = new BrowserWindow({width: 480, height: 320})
    win.on('close', ()=>{win = null})
    win.loadURL(modalPath)
    win.show()
}

module.exports = { 
    openBundleWindow: openBundleWindow
}