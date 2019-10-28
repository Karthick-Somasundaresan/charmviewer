const electron = require('electron')
const appManager = require('../appManager')
const ipc = electron.ipcRenderer
const app = electron.remote.app

const bundleLstDisp = document.getElementById('bndWnd_bndlLst')
const queryLstDisp = document.getElementById('bndWnd_qryLst')

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
    console.log(bundleList)
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

bundleLstDisp.addEventListener('change', function(value){
    let bundleHandler = appManager.getBundleHandler()
    console.log("Changed Value: ", bundleLstDisp.value)
    selectedBundle = bundleHandler.getBundle(bundleLstDisp.value)
    console.log("Selected bundle: ", selectedBundle)
    console.log("Selected Bundle's Query list: ", selectedBundle.queryCollection)
    qryLstHtml = createQueryLstHTML(selectedBundle.queryCollection)
    queryLstDisp.innerHTML = qryLstHtml
    console.log("Query List HTML: ", qryLstHtml)
})

ipc.on('Show-Bundle-Window', function(){
    console.log("Received Shhow-Bundle-Window in BundleWindow.js")
    getRequiredInfo()
})