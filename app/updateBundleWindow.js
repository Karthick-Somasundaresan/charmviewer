const electron = require('electron')
const appManager = require('../appManager')
const path = require('path')
const ipc = electron.ipcRenderer
const app = electron.remote.app
const BrowserWindow = electron.remote.BrowserWindow

const addQueryBtn = document.getElementById("btnAddQuery")
const queryArea = document.getElementById("qryTxt")
const fgColor = document.getElementById("clrFg")
const bgColor = document.getElementById("clrBg")
const queryTable = document.getElementById("tblQryLst")
// const styleTag = document.getElementById("updtBndlWnd_styl")
function delRow(rowId){
    console.log("Row to be deleted: ", rowId)
    queryTable.deleteRow(rowId)
}

function addToQueryTable(query, fgColor, bgColor){
    queryPara = '<p style="background-color:'+ bgColor +'; color:'+ fgColor + ';">'+ query +'</p>'
    rowCnt = queryTable.getElementsByTagName("tr").length
    deleteCellHTML = '<td><button class="btnClss" id="'+ rowCnt +'" onclick="delRow(this.id)""><img class="btnImg" src="../../resources/icons/trash.png"></button></td>'
    queryCellHTML = '<td>' + queryPara + '</td>'
    queryRow = queryTable.insertRow(rowCnt)
    queryCell = queryRow.insertCell(0)
    delCell = queryRow.insertCell(1)
    console.log("QueryCellHTML:", queryCellHTML)
    queryCell.innerHTML = queryCellHTML
    // queryCell.innerHTML = '<td style="background-color:' + bgColor + '; color:' + fgColor + '">' + query + '</td>'
    delCell.innerHTML = deleteCellHTML
    // styleTag.append(rowStyle)
    
}

addQueryBtn.addEventListener('click', function(){
    console.log("Query Value:", queryArea.value)
    console.log("FG color: ", fgColor.value)
    console.log("BG color: ", bgColor.value)
    addToQueryTable(queryArea.value, fgColor.value, bgColor.value)
})

ipc.on('Show-Bundle-Edit-Window', function(event, args){
    console.log("Received Shhow-Bundle-Edit-Window in updateBundleWindow.js", args)
})