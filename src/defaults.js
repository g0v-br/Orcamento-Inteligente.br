// Please do not change this options
// override them in /config.js instead
//
import config from "./../config.js"


//Here some facilities to override defaults with  alternative configuration using environment variables
if (process.env.VUE_APP_LODMAP2D_DATA) {
	const namespace = process.env.VUE_APP_LODMAP2D_DATA;
	config.dereferencingRules = [
		{ "regexp": "/app", "targets": [`${namespace}app.ttl`], "isLast": true },
		{ "regexp": ".*/account/(.+)", "targets": [`${namespace}account/$1.ttl`], "isLast": true },
		{ "regexp": ".*/partition/(.+)", "targets": [`${namespace}accounts.ttl`, `${namespace}partition/$1.ttl`], "isLast": true },
		{ "regexp": ".*/(credits|terms)$", "targets": [`${namespace}$1.ttl`], "isLast": true },
	]
}


export default
	{
		"dereferencingRules": [{ "regexp": ".*", "targets": ["http://localhost:8080/data.ttl"], "isLast": true }],
		...config
	}
