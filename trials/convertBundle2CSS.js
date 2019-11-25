var allBundles = [{"bundleName":"dataStoreBundle1","queryCollection":{"1":{"qid":1,"query":"query01","color":{"fgColor":"#4512FA","bgColor":"white"}},"2":{"qid":2,"query":"query02","color":{"fgColor":"#456789","bgColor":"white"}},"3":{"qid":3,"query":"query03","color":{"fgColor":"#123456","bgColor":"white"}},"4":{"qid":4,"query":"query04","color":{"fgColor":"8899AA","bgColor":"white"}}}},{"bundleName":"dataStoreBundle2","queryCollection":{"1":{"qid":1,"query":"query11","color":{"fgColor":"#998877","bgColor":"black"}},"2":{"qid":2,"query":"query12","color":{"fgColor":"#778866","bgColor":"black"}},"3":{"qid":3,"query":"query13","color":{"fgColor":"#880066","bgColor":"black"}},"4":{"qid":4,"query":"query14","color":{"fgColor":"00DD34","bgColor":"black"}}}},{"bundleName":"Bundle3","queryCollection":{"1":{"qid":1,"query":"Query31","color":{"fgColor":"#00ceff","bgColor":"#ffff00"}},"2":{"qid":2,"query":"Query32","color":{"fgColor":"#00fe00","bgColor":"#ffff00"}},"3":{"qid":3,"query":"Query33","color":{"fgColor":"#00fe00","bgColor":"#ff0000"}}}},{"bundleName":"TestLogBundle","queryCollection":{"1":{"qid":1,"query":"Incident01 AND \"with Scenario02\" AND Running","color":{"fgColor":"#1034fc","bgColor":"#fffd00"}}}}]
var cssText = ""
allBundles.forEach(bundle => {
    let bundleName = bundle.bundleName
    for (const item in bundle.queryCollection) {
        if (bundle.queryCollection.hasOwnProperty(item)) {
            const element = bundle.queryCollection[item];
            console.log(element)
            let qid = element.qid
            cssText += "." + bundleName + "_" + qid + " {" + "color:" + element.color.fgColor + " !important; background:" +element.color.bgColor + "}\n"
        }
    }
});
console.log("Converted CSS: " + cssText)