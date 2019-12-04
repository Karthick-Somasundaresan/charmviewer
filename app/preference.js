const electron = require('electron')
const ipc = electron.ipcRenderer
const dialog = electron.remote.dialog
const BrowserWindow = electron.remote.BrowserWindow

const saveBtn = document.getElementById("btnSavePrefer")
const cancelBtn = document.getElementById("btnCancelPrefer")
const fntSize = document.getElementById("font-size")
const fntFam = document.getElementById("font-family")
const theme = document.getElementById("theme")

cancelBtn.addEventListener('click', function(){
    // ipc.send('close-update-bundle-window')
    window.close()
})

saveBtn.addEventListener('click', function(){
    let sizeVal = fntSize.value
    let familyVal = fntFam.value
    let thm = theme.value
    console.log({sizeVal, familyVal, thm})
    ipc.send('update-usr-preferences', {"fontSize": sizeVal, "fontFamily": familyVal, "theme":thm})
    window.close()
})