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
                    readOnly: true
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
                    readOnly: true
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
