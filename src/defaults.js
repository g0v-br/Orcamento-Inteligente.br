// Please do not change this options
// override them in /config.js instead
//
import config from "./../config.js"


//Here some facilities to override defaults with  alternative configuration using environment variables
const namespace = process.env.VUE_APP_LODMAP2D_DATA || "http://localhost:8080/data.ttl";

config.dereferencingRules = namespace.endsWith("/")
	?[
		{ "regexp": "/", "targets": [`${namespace}app.ttl`] },
		{ "regexp": "/partition/(\\w+)$", "targets": [`${namespace}partitions.ttl`], "isLast": true  },
		{ "regexp": "/account/(\\w+)$", "targets": [`${namespace}accounts.ttl`,`${namespace}account/$1.ttl`], "isLast": true },
		{ "regexp": "/(credits|terms)$", "targets": [`${namespace}$1.ttl`], "isLast": true },
	]
	:[{ "regexp": ".*", "targets": [namespace] , "isLast": true}];


export default config;
