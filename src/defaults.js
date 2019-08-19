// Please do not change this options
// override them in /config.js instead
//
import config from "./../config.js"


//Here some facilities to override defaults with  alternative configuration using environment variables
if (process.env.VUE_APP_LODMAP2D_DATA) {
	const domain = process.env.VUE_APP_LODMAP2D_DATA;
	config.dereferencingRules = [
		{ "regexp": ".*", "targets": [`${domain}/app.ttl`] },
		{ "regexp": ".*/account/(.+)", "targets": [`${domain}/account/$1.ttl`], "isLast": true },
		{ "regexp": ".*/partition/(.+)", "targets": [`${domain}/accounts.ttl`, `${domain}/partition/$1.ttl`], "isLast": true },
	]
}


export default
{
	"dereferencingRules": [{ "regexp":".*" , "targets": [ "/data.ttl"], "isLast": true }],
	...config
}
