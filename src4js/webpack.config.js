var config = require('./weaconfig');

var appName = "newportal";

// appName = "no046"
appName = "ecology9wf"

var mode = "release";

//mode = "debug";

var node_env = null;

//node_env = "development";
//node_env = "production";
const apps = {
	"ecology9": {
		entry: "./pc/main/index.js",
		output: "../wui/theme/ecology9/js/index.js",
		styleUrl: "../wui/theme/ecology9/css/index.css"
	},
	"ecology9wf4single": {
		entry: "./pc/workflow/single.js",
		output: "../spa/workflow/index4single.js",
		outputlib: {
			library: "weaWorkflow",
			libraryTarget: "umd"
		}
	},
	"global4js": {
		entry: "./pc/global4js/index.js",
		output: "../spa/workflow/global.js",
		styleUrl: "../spa/workflow/global.css",
	},
	"portablglobal4js":{
		entry: "./pc/global4js/portalindex.js",
		output: "../wui/global.js",
		styleUrl: "../wui/global.css",
	},
	"ecology9wf": {
		entry: "./pc/workflow/index.js",
		output: "../spa/workflow/index.js",
		styleUrl: "../spa/workflow/index.css",
		outputlib: {
			library: "weaWorkflow",
			libraryTarget: "umd"
		}
	}
}

module.exports = config.create(apps[appName], mode, node_env);