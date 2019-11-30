const ipc = require('electron').ipcRenderer
const amdLoader = require('../../node_modules/monaco-editor/min/vs/loader.js');
const path = require('path')
const amdRequire = amdLoader.require;
const amdDefine = amdLoader.require.define
var editor = null
var filtEditor = null
const fontSizeArray = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32]
var currentFontIndex = 3
function uriFromPath(_path) {
	var pathName = path.resolve(_path).replace(/\\/g, '/');
	if (pathName.length > 0 && pathName.charAt(0) !== '/') {
		pathName = '/' + pathName;
	}
	return encodeURI('file://' + pathName);
}

var isResizing = false;
var last_mouse_pos;
dragDiv = document.getElementById("drag")
dragDiv.addEventListener("mousedown", function(event){
    isResizing = true
    last_mouse_pos = event.y
    console.log("Started resizing")
})
document.addEventListener('mousemove', function(e){
    if (isResizing) {
        container = document.getElementById("container")
        bigContainer = document.getElementById("big-container")
        filtContainer = document.getElementById("filter-container")
        // console.log("Computed height: ", parseInt(getComputedStyle(container, '').height))
        // console.log(event.clientY)
        delta = last_mouse_pos - event.clientY
        last_mouse_pos = event.clientY

        // console.log(delta)
        container.style.height = parseInt(getComputedStyle(container, "").height) - delta + "px"
        // console.log("mod height: ", container.style.height)
        filtContainer.style.height = parseInt(getComputedStyle(filtContainer,"").height) + delta + "px"
        // console.log(event.clientX)
    }
})
document.addEventListener('mouseup', function(e){
    isResizing = false
    console.log("Done resizing")

})
amdRequire.config({
	baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/min'))
});

ipc.on('Display-File', function(event, contents){
    console.log("Received file contents:");
    updateLogViewWindow(contents, "container")
    contents = null
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
    updateLogViewWindow(filteredContent,"filter-container")
})

function updateLogDecorations(viewEditor, line, cssRule) {
    for (let index = 0; index < cssRule.length; index++) {
        const element = cssRule[index];
        if (viewEditor === filtEditor){
            viewEditor.deltaDecorations([], [{
                range: new monaco.Range(index + 1, 1, index + 1, 1),
                options: {
                    isWholeLine: true,
                    inlineClassName: element
                }
            }])
        } else {
            viewEditor.deltaDecorations([], [{
                range: new monaco.Range(line[index + 1], 1, line[index + 1], 1),
                options: {
                    isWholeLine: true,
                    inlineClassName: element
                }
            }])
        }
         
    }
} 



function updateLogViewWindow(content, containerId) {
    amdRequire(['vs/editor/editor.main'], function() {

        
        console.log("About to create an editor", typeof(content))
        if (containerId === "container"){
            
            if (editor === null) {
                editor = monaco.editor.create(document.getElementById(containerId), {
                    value: content.logs.join('\n'),
                    automaticLayout: true,
                    readOnly: true,
                    fontSize: fontSizeArray[currentFontIndex]
                });
            } else {
                editor.setValue(content.logs.join('\n'))
            }
            // addMouseListenerForEditor(editor)
        } else {
            if (filtEditor === null ){
                filtEditor = monaco.editor.create(document.getElementById(containerId), {
                    value: content.logs.join('\n'),
                    automaticLayout: true,
                    lineNumbers: mapLineNumbers,
                    readOnly: true,
                    fontSize: fontSizeArray[currentFontIndex]
                })
            } else {
                filtEditor.setValue(content.logs.join('\n'))
            }
            
            updateLogDecorations(filtEditor, content.lines, content.rules)
            updateLogDecorations(editor, content.lines, content.rules)
            // filtEditor.deltaDecorations([],[
            //     {
            //         range: new monaco.Range(2,1,2,1),
            //         options: {
            //             isWholeLine: true, 
            //             className: "trialCSS"
            //         }
            //     }
            // ])
            // filtEditor.deltaDecorations([],[
            //     {
            //         range: new monaco.Range(1,1,1,1),
            //         options: {
            //             isWholeLine: true, 
            //             className: "testCSS"
            //         }
            //     }
            // ])
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
            // editor.deltaDecorations([],[
            //     {
            //         range: new monaco.Range(3,1,3,1),
            //         options: {
            //             isWholeLine: true, 
            //             className: "testCSS"
            //         }
            //     }
            // ])
            // editor.deltaDecorations([],[
            //     {
            //         range: new monaco.Range(2,1,2,1),
            //         options: {
            //             isWholeLine: true, 
            //             className: "trialCSS"
            //         }
            //     }
            // ])
            editor.focus()
        }
}

ipc.on('update-css-styles', function(event, cssText){
    style = document.getElementById('viewer-css')
    console.log("style: ", style)
    style = document.createElement("style")
    style.setAttribute("id", "viewer-css")
    style.innerHTML = cssText
    style.setAttribute('type', 'text/css')
    document.body.appendChild(style)
})

ipc.on('Increase-Font-Size', function(event){
    console.log("Received command to increase fontsize")
    if (currentFontIndex != fontSizeArray.length - 2){
        currentFontIndex += 1
        if (filtEditor !== null) {
            filtEditor.updateOptions({
                fontSize: fontSizeArray[currentFontIndex]
            })
        }
        
        if(editor !== null){
            editor.updateOptions({
                fontSize: fontSizeArray[currentFontIndex]
            })
        }
        
    }
})

ipc.on('Decrease-Font-Size', function(event){
    console.log("Received command to decrease fontsize")
    if (currentFontIndex != 0){
        currentFontIndex -= 1
        if (filtEditor !== null ){
            filtEditor.updateOptions({
                fontSize: fontSizeArray[currentFontIndex]
            })
        }
        if (editor !== null) {
            editor.updateOptions({
                fontSize: fontSizeArray[currentFontIndex]
            })
        }
    }
})
