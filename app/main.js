const { app, BrowserWindow, Menu} = require('electron')
const ipc = require('electron').ipcMain
const actionHandler = require("./menuActionHandler")
const appManager = require("./appManager")
const path = require('path')
const fs = require('fs')
const dialog = require('electron').dialog
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win


function createBundleMenu(bundleList){
    var bundleMenu = {
        label: "Bundle",
        submenu: [{
            label: "OpenBundle... ",
            accelerator: "CmdOrCtrl+B",
            click: actionHandler.openBundleWindow
        }]
    }
    sepObj = {type: "separator"}
    bundleMenu.submenu.push(sepObj)
    for (bundle in bundleList){
        bundleObj = {}
        bundleObj["label"] = bundleList[bundle];
        bundleObj["type"] = "radio"
        bundleObj["checked"] = false
        bundleObj["click"] = enableBundle
        // bundleObj["click"] = actionHandler.selectBundle
        bundleMenu.submenu.push(bundleObj)
    }
    return bundleMenu
}

function enableBundle(menuItem, window, event){
    appManager.getBundleHandler().enableBundle(menuItem.label)
    // window.webContents.send("Bundle-Change-Event", menuItem.label)
    bundleObj = appManager.getBundleHandler().getBundle(menuItem.label)
    console.log("Received bundleObj query count in main: ", bundleObj.getQueryListSize())
    console.log("Received bundleObj in main: ", {bundleObj})
    console.log("loaded Filename: ", window["filename"])
    actionHandler.filterFileWithBundle(window["filename"], bundleObj, function(filteredContents){
        console.log("Inside callback!!!", filteredContents)
        window.webContents.send("Filtered-Output", filteredContents)
    })
}

function createApplicationMenu(bundleList){
    console.log("Creating application Menu")
    bundleMenu = createBundleMenu(bundleList)
    fileMenu = {
        label: "File",
        submenu: [{
            label: "Open",
            'accelerator': "Command + o",
            'click': actionHandler.loadFile
        },{
            label: "Close Window"
        }]
    };
    editMenu = {
        label: "Edit",
        submenu: [{
            label: "Find"
        }]
    };
    viewMenu = {
        label: "view",
        submenu:[{
            label: "show line"
        }, {
            type: "separator"
        }, {
            label: "Detach output Window",
            type: 'checkbox',
            checked: true 
        }, {
            label: "Natural log color",
            type: 'checkbox',
            checked: true
        }]
    };
    aboutMenu = {
        label: "About"
    };
    // let template = [ fileMenu, editMenu, bundleMenu, viewMenu, aboutMenu]
    let template = [ fileMenu, editMenu, bundleMenu, viewMenu, aboutMenu]
    if (process.platform === 'darwin'){
        const appName = app.getName()
        template.unshift({
            'label': appName,
            'submenu': [{
                'label': 'preferences...',
                'accelerator': "Command+,"
            }, {
                label: "Quit " + appName,
                'accelerator':  "Command+Q",
                'click': app.quit
            }]
               
        })
    }
    // console.log(JSON.stringify(template))
    // console.log(typeof(template))
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function createWindow () {
  // Create the browser window.
  console.log("Creating Application Window")
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('windows/fileViewWindow.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
    console.log("Application is ready!")
    appManager.initializeBundles(app.getAppPath()+ "/../test/")
    // appBundleHandler = new BundleHandler(app.getAppPath() + "/../test/")
    // console.log("App Data path:", app.getAppPath())
    // console.log("Bundle List: ", appBundleHandler.getAllBundleNames())
    bundleList = appManager.getBundleHandler().getAllBundleNames()
    createApplicationMenu(bundleList)
    createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipc.on("Show-Bundle-Window", function(){
    console.log("Received event 'shhow-bundle-window'")
})

ipc.on('Test-Msg', function(event,args){
    console.log("Received test msg in main.js")
    event.sender.send("Test-Msg-Reply", "aloooo")
})

ipc.on('Create-Bundle', function(event, bundleObj){
    console.log("Received Create-Bundle Event with arg:", bundleObj)
    appManager.getBundleHandler().createBundle(bundleObj.bundleName, bundleObj.queryList)
    actionHandler.updateBundleWindow()
    
})

ipc.on("All-Bundle-Request", function(event){
    console.log("Received All-Bundle-Request in main.js")
    bundleCollection = appManager.getBundleHandler().getAllBundles()
    event.sender.send("All-Bundle-Response", bundleCollection)
})

ipc.on("Bundle-Obj-Request", function(event, selectedBundleName){
    console.log("Received GetBundleInfo for bundle:", selectedBundleName)
    bundleInfo = appManager.getBundleHandler().getBundle(selectedBundleName)
    event.sender.send("Bundle-Obj-Response", bundleInfo)
})


ipc.on('Delete-Bundle-Request', function(event, deleteBundleName){
    appManager.getBundleHandler().deleteBundle(deleteBundleName)
    actionHandler.updateBundleWindow()
})

ipc.on("Show-Bundle-Edit-Window", function(event, bundleName){
    console.log("Received Event Show-Bundle-Edit-Window")
    let modalPath = path.join("file://", __dirname, "./windows/updateBundleWindow.html")
    win = new BrowserWindow({height:280, width:760,webPreferences: {
        nodeIntegration: true
      },
     resizable: false,
    maximizable: false})
    win.on('close', ()=>{win = null})
    win.loadURL(modalPath)
    win.webContents.openDevTools()
    win.webContents.on('ready-to-show', function(){
        console.log(" UpdateBundleWindow ready to show")
        win.show()
    })
    if(bundleName !== undefined && bundleName !== null ){

        win.webContents.on('did-finish-load',function(){
            console.log("Emitting event Show-Bundle-Edit-Window for bundle: ", bundleName)
            bundleObj = appManager.getBundleHandler().getBundle(bundleName)
            console.log("Emitting obj: ", {bundleObj})
            win.webContents.send("Show-Bundle-Edit-Window", bundleObj)
        })
    }
})


ipc.on('Import-Bundle-File', function(event, fileName){
    let rawBundle = fs.readFileSync(fileName[0])
    let bundleJson = undefined
    try {
        bundleJson = JSON.parse(rawBundle)
        appManager.getBundleHandler().importBundle(bundleJson)
        actionHandler.updateBundleWindow()
    } catch (error) {
        dialog.showErrorBox("Unable to open file", "Unable to open file:" + fileName)
    }
})

ipc.on("Query-Priority-Change", function(event, changeObj){
    appManager.getBundleHandler().changePriority(changeObj["bundlename"], changeObj["qid"], changeObj["direction"])
    // actionHandler.updateBundleWindow()
    bundleInfo = appManager.getBundleHandler().getBundle(changeObj["bundlename"])
    event.sender.send("Bundle-Obj-Response", bundleInfo)
    
})

ipc.on("Export-Bundle-File", function(event, exportObj){
    exportBundleJson = appManager.getBundleHandler().exportBundle(exportObj["bundleToExport"])
    console.log("Exporting Bundle: ", exportBundleJson, " to file: ", exportObj["fileName"])
    fs.writeFile(exportObj["fileName"], JSON.stringify(exportBundleJson), function(err){
        if (err){
            dialog.showErrorBox("Unable to save file", "Unable to save file: " + exportObj[fileName])
        }
    })
})

ipc.on("Get-Enabled-Bundle", function(event){
    console.log("Received Enabled Bundled request")
    let bundleName = appManager.getBundleHandler().getEnabledBundleName()
    let bundleObj = appManager.getBundleHandler().getBundle(bundleName)
    event.sender.send("Get-Enabled-Bundle-Response", bundleObj)
})

ipc.on('Enable-Bundle', function(event, bundleName){
    appManager.getBundleHandler().enableBundle(bundleName, true)
})