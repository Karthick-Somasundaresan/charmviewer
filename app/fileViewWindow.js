const ipc = require('electron').ipcRenderer
const fileOp = require("../../lib/FileOperations")
const amdLoader = require('../../node_modules/monaco-editor/min/vs/loader.js');
const path = require('path')
const amdRequire = amdLoader.require;
const amdDefine = amdLoader.require.define


function uriFromPath(_path) {
	var pathName = path.resolve(_path).replace(/\\/g, '/');
	if (pathName.length > 0 && pathName.charAt(0) !== '/') {
		pathName = '/' + pathName;
	}
	return encodeURI('file://' + pathName);
}


amdRequire.config({
	baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/min'))
});

ipc.on('File-To-Load', function(event, fileName){
    console.log("Received file name to open: ", fileName)
    fileOp.openFileOperation(fileName)
})

function updateLogViewWindow(content) {
    amdRequire(['vs/editor/editor.main'], function() {
		console.log("About to create an editor")
		var editor = monaco.editor.create(document.getElementById('container'), {
            value: content.join('\n'),
            automaticLayout: true
		});
	}, function(arg){
        console.log("Error in display: ", arg)
    });

}


var content = []
fileOp.fileEvents.on("read-line", function(line){
    content.push(line)
})

fileOp.fileEvents.on("read-complete", function(){
    console.log("Completed reading file!! Time to load!!!")
    updateLogViewWindow(content)

})