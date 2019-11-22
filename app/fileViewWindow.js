const ipc = require('electron').ipcRenderer
const amdLoader = require('../../node_modules/monaco-editor/min/vs/loader.js');
const path = require('path')
const amdRequire = amdLoader.require;
const amdDefine = amdLoader.require.define
var editor = null
var filtEditor = null

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

ipc.on('Display-File', function(event, contents){
    console.log("Received file contents:");
    updateLogViewWindow(contents, "container")
})

ipc.on("File-Content-Response", function(content){
    updateLogViewWindow(content, "container")
})

function mapLineNumbers(origlineNo) {
    if (origlineNo < linemap.length) {
		return linemap[origlineNo];
	}
	return origlineNo;
}
var linemap = []
ipc.on("Filtered-Output", function(event, filteredContent){
    console.log("Received filtered output", filteredContent)
    linemap = filteredContent.lines
    linemap.unshift(0)
    updateLogViewWindow(filteredContent.logs,"filter-container")
})

function updateLogViewWindow(content, containerId) {
    amdRequire(['vs/editor/editor.main'], function() {
        console.log("About to create an editor", typeof(content))
        if (containerId === "container"){
            editor = monaco.editor.create(document.getElementById(containerId), {
                value: content.join('\n'),
                automaticLayout: true,
                readOnly: true
            });
            // addMouseListenerForEditor(editor)
        } else {
            filtEditor = monaco.editor.create(document.getElementById(containerId), {
                value: content.join('\n'),
                automaticLayout: true,
                lineNumbers: mapLineNumbers,
                readOnly: true
            })
            filtEditor.onMouseDown(filterEditerMouseDown)

        }
		;
	}, function(arg){
        console.log("Error in display: ", arg)
    });
}

function filterEditerMouseDown(event) {
        // console.log({event})

        clickedLine = event.target.position.lineNumber;
        mappedLine = mapLineNumbers(clickedLine)
        console.log("Clicked on line: ", clickedLine)
        console.log("Mapped line in the main editor: ", mappedLine)
        if(editor !== null && editor !== undefined) {
            editor.revealLine(mappedLine)
            editor.focus()
        }
}

