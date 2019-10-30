const electron = require('electron')
const appManager = require('../appManager')
const path = require('path')
const ipc = electron.ipcRenderer
const app = electron.remote.app
const BrowserWindow = electron.remote.BrowserWindow

const bundleLstDisp = document.getElementById('bndWnd_bndlLst')
const queryLstDisp = document.getElementById('bndWnd_qryLst')
const addBundle = document.getElementById('bndWnd_addBndlBtn')
const rmBundle = document.getElementById('bndWnd_rmBndlBtn')
const importBundle = document.getElementById('bndWnd_imprtBndlBtn')
const exportBundle = document.getElementById('bndWnd_exptBndlBtn')

function createOptionHTML(listOfOptions, cssclass){
    var optionHTML = ""
    for (option in listOfOptions ){
        optionHTML = optionHTML + '<option class="' + cssclass +'" value="'+ listOfOptions[option] +'">'+ listOfOptions[option]+ '</option>'
    }
    return optionHTML
}

function createQueryLstHTML(queryCollection){
    queryLst = Object.keys(queryCollection)
    var optionHTML = ""
    for(query in queryCollection){
        optionHTML = optionHTML + '<option style="background-color:' + queryCollection[query]["color"]["bgColor"]+ '; color:' + queryCollection[query]["color"]["fgColor"] + '" value="'+ queryCollection[query]["query"] +'">'+ queryCollection[query]["query"]+ '</option>'
    }
    return optionHTML
}

function getRequiredInfo(selectedInfo = 0){
    appManager.initializeBundles(app.getAppPath() + "/../test/")
    let bundleHandler = appManager.getBundleHandler()
    bundleList = bundleHandler.getAllBundleNames()
    // console.log(bundleList)
    optLstHtml = createOptionHTML(bundleList, "opt")
    console.log("Option HTML Str: ", optLstHtml)
    console.log("Selected Info: ", selectedInfo)
    bundleLstDisp.innerHTML = optLstHtml
    selectedBundle = bundleHandler.getBundle(bundleList[selectedInfo])
    console.log("Selected bundle: ", selectedBundle)
    console.log("Selected Bundle's Query list: ", selectedBundle.queryCollection)
    qryLstHtml = createQueryLstHTML(selectedBundle.queryCollection)
    queryLstDisp.innerHTML = qryLstHtml
    console.log("Query List HTML: ", qryLstHtml)
}

ipc.on('Bundle-Obj-Response', function(event, selectedBundle){
    console.log("Selected bundle: ", selectedBundle)
    console.log("Selected Bundle's Query list: ", selectedBundle.queryCollection)
    qryLstHtml = createQueryLstHTML(selectedBundle.queryCollection)
    queryLstDisp.innerHTML = qryLstHtml
    console.log("Query List HTML: ", qryLstHtml)

})

bundleLstDisp.addEventListener('change', function(value){
    // let bundleHandler = appManager.getBundleHandler()
    console.log("Changed Value: ", bundleLstDisp.value)
    // selectedBundle = bundleHandler.getBundle(bundleLstDisp.value)
    ipc.send('Bundle-Obj-Request', bundleLstDisp.value)
})


addBundle.addEventListener('click', function(event){
    console.log("Add button clicked: ", event)
    // let modalPath = path.join("file://", __dirname, "./updateBundleWindow.html")
    // win = new BrowserWindow({height:280, width:760,webPreferences: {
    //     nodeIntegration: true
    //   },
    //  resizable: false,
    // maximizable: false})
    // win.on('close', ()=>{win = null})
    // win.loadURL(modalPath)
    // win.webContents.openDevTools()
    // win.on('ready-to-show', function(){
    //     win.show()
    // })
    // win.on('did-finish-load',function(){
    //     console.log("Emitting event Show-Bundle-Edit-Window")
    //     win.webContents.send("Show-Bundle-Edit-Window")
    //     ipc.send('Test-Msg', "Alllloooo")
    // })
    ipc.send('Show-Bundle-Edit-Window')
})


rmBundle.addEventListener('click', function(event){
    console.log("Delete button clicked: ", event)
})


importBundle.addEventListener('click', function(event){
    console.log("Import button clicked: ", event)
})


exportBundle.addEventListener('click', function(event){
    console.log("Export button clicked: ", event)
})


ipc.on('All-Bundle-Response', function(event, bundleInfo){
    console.log("Received Bundle Info: ", {bundleInfo})
    bundleNameList = []
    for (obj in bundleInfo){
        bundleNameList.push(bundleInfo[obj].bundleName)
    }
    // bundleNameList = Object.keys(bundleInfo)
    console.log(bundleNameList)
    optLstHtml = createOptionHTML(bundleNameList, "opt")
    bundleLstDisp.innerHTML = optLstHtml
    selectedBundle = bundleInfo[0]
    console.log("Selected Bundle's Query list: ", selectedBundle.queryCollection)
    qryLstHtml = createQueryLstHTML(selectedBundle.queryCollection)
    queryLstDisp.innerHTML = qryLstHtml
    console.log("Query List HTML: ", qryLstHtml)
})
ipc.on('Show-Bundle-Window', function(){
    console.log("Received Shhow-Bundle-Window in BundleWindow.js")
    // getRequiredInfo()
    ipc.send("All-Bundle-Request")
})

ipc.on('Test-Msg-Reply', function(){
    console.log("Received Test-Msg-Reply")
})

ipc.on('Show-Bundle-Edit-Window', function(){
    console.log("Received Shhow-Bundle-Edit-Window in BundleWindow.js")
})