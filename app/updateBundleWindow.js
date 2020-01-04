const electron = require('electron')
const path = require('path')
const ipc = electron.ipcRenderer
const app = electron.remote.app
const dialog = electron.remote.dialog
const BrowserWindow = electron.remote.BrowserWindow

const addQueryBtn = document.getElementById("btnAddQuery")
const queryArea = document.getElementById("qryTxt")
const fgColor = document.getElementById("clrFg")
const bgColor = document.getElementById("clrBg")
const queryTable = document.getElementById("tblQryLst")
const saveBtn = document.getElementById("updtBndlWn_save")
const cancelBtn = document.getElementById("updtBndlWn_cancel")
const bndlEnbl = document.getElementById("bndlEnable")
const bndlName = document.getElementById("txtBndlName")
// const styleTag = document.getElementById("updtBndlWnd_styl")
function delRow(rowId){
    // console.log("Row to be deleted: ", rowId)
    queryTable.deleteRow(rowId)
    dialog.showErrorBox("Delete Query", "Row deleted Successfully")
}

function addToQueryTable(query, fgColor, bgColor){
    if (query === "" || query === null || query === undefined){
        dialog.showErrorBox("Unable to Add Query", "Unable to Add Query: Query is empty");
        return
    }
    queryPara = '<p class="queryContainer" style="background-color:'+ bgColor +'; color:'+ fgColor + ';">'+ query +'</p>'
    rowCnt = queryTable.getElementsByTagName("tr").length
    deleteCellHTML = '<td><button class="btnClss" id="'+ rowCnt +'" onclick="delRow(this.id)""><img class="btnImg" src="../../resources/icons/trash.png"></button></td>'
    queryCellHTML = '<td>' + queryPara + '</td>'
    queryRow = queryTable.insertRow(rowCnt)
    queryCell = queryRow.insertCell(0)
    delCell = queryRow.insertCell(1)
    // console.log("QueryCellHTML:", queryCellHTML)
    queryCell.innerHTML = queryCellHTML
    // queryCell.innerHTML = '<td style="background-color:' + bgColor + '; color:' + fgColor + '">' + query + '</td>'
    delCell.innerHTML = deleteCellHTML
    // styleTag.append(rowStyle)
    
}

addQueryBtn.addEventListener('click', function(){
    // console.log("Query Value:", queryArea.value)
    // console.log("FG color: ", fgColor.value)
    // console.log("BG coloHEX r: ", bgColor.value)
    addToQueryTable(queryArea.value, fgColor.value, bgColor.value)
})

function convertRGBtoHEX(rgbStr) {
    red = ""
    green = ""
    blue = ""
    rgbVal=rgbStr.replace("rgb(", "").replace(")","")
    redInt = parseInt(rgbVal.split(",")[0])
    greenInt = parseInt(rgbVal.split(",")[1])
    blueInt = parseInt(rgbVal.split(",")[2])
    red = redInt.toString(16).length == 1 ? "0" + redInt.toString(16) : redInt.toString(16)
    green = greenInt.toString(16).length == 1 ? "0" + greenInt.toString(16) : greenInt.toString(16)
    blue = blueInt.toString(16).length == 1 ? "0" + blueInt.toString(16) : blueInt.toString(16)
    return "#" + red + green + blue
}

cancelBtn.addEventListener('click', function(){
    // ipc.send('close-update-bundle-window')
    window.close()
})
saveBtn.addEventListener('click', function(){
    let bundleName = txtBndlName.value
    let rowCnt = queryTable.getElementsByTagName("tr").length
    let queryLst = []
    
    
    if (bundleName === "" || bundleName === null || bundleName === undefined){
        dialog.showErrorBox("Unable to save Bundle", "Unable to save Bundle: Bundle Name not present");
        return
    }
    if (rowCnt === 0 | rowCnt === null || rowCnt === undefined){
        dialog.showErrorBox("Unable to save Bundle", "Unable to save Bundle: Please add at least one query");
        return
    }
    // document.getElementById("tblQryLst").rows[2].getElementsByTagName("p")[0].style["background-color"]
    for(let i = 1; i < rowCnt; i++){
        tempObj = {}
        // console.log("index: ", i)
        // console.log("cell HTML content:", queryTable.rows[i].cells[0].innerHTML)
        let query = queryTable.rows[i].getElementsByTagName("p")[0].innerHTML
        let bgColor = convertRGBtoHEX(queryTable.rows[i].getElementsByTagName("p")[0].style["background-color"])
        let fgColor = convertRGBtoHEX(queryTable.rows[i].getElementsByTagName("p")[0].style["color"])
        // console.log("cell Value content:", queryTable.rows[i].getElementsByTagName("p")[0].innerHTML)
        // console.log("cell bgColor:", convertRGBtoHEX(queryTable.rows[i].getElementsByTagName("p")[0].style["background-color"]))
        // console.log("cell fgColor:", convertRGBtoHEX(queryTable.rows[i].getElementsByTagName("p")[0].style["color"]))
        tempObj = {"query": query, "color": {"fgColor": fgColor, "bgColor": bgColor}}
        queryLst.push(tempObj)
    }
    bundle = {"bundleName": bundleName, "queryList": queryLst}
    ipc.send("Create-Bundle", bundle)
    // console.log("Create Bundle: ", bundle)
    window.close()
})

function updatePageElements(bundleObj){
    bndlName.value = bundleObj.bundleName
    for(queryObj in bundleObj.queryCollection){
        addToQueryTable(bundleObj.queryCollection[queryObj].query, bundleObj.queryCollection[queryObj].color.fgColor,  bundleObj.queryCollection[queryObj].color.bgColor)
    }
}

ipc.on('Show-Bundle-Edit-Window', function(event, args){
    // console.log("Received Show-Bundle-Edit-Window in updateBundleWindow.js", event, args)
    if (args !== undefined && args !== null){
        updatePageElements(args)
    }
})