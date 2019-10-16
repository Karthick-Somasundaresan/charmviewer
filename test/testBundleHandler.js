const BundleHandler = require('../lib/BundleHandler')

var appBundleHandler = new BundleHandler()

var queryList1 = [ 
                    {"query": "query01", "color": "color01"},
                    {"query": "query02", "color": "color02"},
                    {"query": "query03", "color": "color03"},
                    {"query": "query04", "color": "color04"},
                ]
var queryList2 = [ 
                    {"query": "query11", "color": "color11"},
                    {"query": "query12", "color": "color12"},
                    {"query": "query13", "color": "color13"},
                    {"query": "query14", "color": "color14"},
                ]
var queryList3 = [ 
                    {"query": "query21", "color": "color21"},
                    {"query": "query22", "color": "color22"},
                    {"query": "query23", "color": "color23"},
                    {"query": "query24", "color": "color24"},
                ]
appBundleHandler.createBundle("testBundle1", queryList1)
appBundleHandler.createBundle("testBundle2", queryList2)
appBundleHandler.enableBundle("testBundle2", true)
console.log("testBundle1 status: ", appBundleHandler.getBundleStatus("testBundle1"))
console.log("testBundle2 status: ", appBundleHandler.getBundleStatus("testBundle2"))
console.log("Exported testBundle1: ", appBundleHandler.exportBundle("testBundle1"))
console.log("List of bundles (before delete): ", appBundleHandler.getAllBundleNames())
let exptBundle = appBundleHandler.exportBundle("testBundle1")
appBundleHandler.deleteBundle("testBundle1")
console.log("List of bundles (after delete): ", appBundleHandler.getAllBundleNames())
appBundleHandler.importBundle(exptBundle)
console.log("List of bundles (after import): ", appBundleHandler.getAllBundleNames())
console.log("Exported testBundle1: ", appBundleHandler.exportBundle("testBundle1"))
console.log("Bundle2: ", appBundleHandler.getBundle("testBundle2"))
console.log("All Bundles: ", appBundleHandler.getAllBundles())
console.log("Update QueryList of Bundle2")
appBundleHandler.updateBundle("testBundle2", queryList3)
console.log("Exported testBundle2: ", appBundleHandler.exportBundle("testBundle2"))
