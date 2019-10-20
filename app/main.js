const { app, BrowserWindow, Menu } = require('electron')
const actionHandler = require("./menuActionHandler")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win



function createApplicationMenu(){
    console.log("Creating application Menu")
    let template = [{
        label: "File",
        submenu: [{
            label: "Open",
            'accelerator': "Command + o"
        },{
            label: "Close Window"
        }]
    }, {
        label: "Edit",
        submenu: [{
            label: "Find"
        }]
    }, {
        label: "Bundle",
        submenu: [{
            label: "OpenBundle... ",
            accelerator: "CmdOrCtrl+B",
            click: actionHandler.openBundleWindow
        }]
    }, {
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
    }, {
        label: "About"
    }]
    if (process.platform === 'darwin'){
        const appName = app.getName()
        template.unshift({
            'label': appName,
            'submenu': [{
                'label': 'preferences...',
                'accelerator': "Command+,"
            }, {
                label: "Quit " + appName
            }]
               
        })
    }
    console.log(JSON.stringify(template))
    console.log(typeof(template))
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
  win.loadFile('windows/index.html')

  // Open the DevTools.
//   win.webContents.openDevTools()

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
    createApplicationMenu()
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