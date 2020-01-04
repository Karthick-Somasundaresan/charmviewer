const {BundleHandler} = require('../lib/BundleHandler')

var appBundleHandler = null

function initializeBundles(userLocation){
    if(appBundleHandler == null){
        appBundleHandler = new BundleHandler(userLocation)
        //console.log("<AppManager>: initializeBundles : appBundleHandler: ", appBundleHandler)
    }
}

function getBundleHandler() {
    //console.log("<AppManager>: getBundleHandler : appBundleHandler: ", appBundleHandler)
    return appBundleHandler
}

module.exports = {
    "initializeBundles": initializeBundles,
    "getBundleHandler": getBundleHandler
}

