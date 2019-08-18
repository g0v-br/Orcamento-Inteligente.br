//Pseudo codice da implementare
//if GETENV('LODMAP2D_DATA')
//	$dep=GETENV('LODMAP2D_DATA')
//
//export default
//{
//	"dereferencingRules": [
//		{ "regexp":".*" , "targets": [ dep+"/app.ttl"] } ,
//		{ "regexp":"/account/(.+)" , "targets": [ dep+"/account/$1.ttl" ] , "isLast": true } ,
//		{ "regexp":"/partition/(.+)" , "targets": [ dep+"/accounts.ttl", dep+"/partition/$1.ttl" ] , "isLast": true } ,
//	]
//}
//else
//

let config = {
	"dereferencingRules": [
		{ "regexp": ".*", "targets": ["http://example.com/app.ttl"] },
		{ "regexp": ".*/account/(.+)", "targets": ["http://example.com/account/$1.ttl"], "isLast": true },
		{ "regexp": ".*/partition/(.+)", "targets": ["http://example.com/accounts.ttl", "http://example.com/partition/$1.ttl"], "isLast": true },
	]
}

if (process.env.VUE_APP_DOMAIN) {
	const domain = process.env.VUE_APP_DOMAIN;
	config = {
		"dereferencingRules": [
			{ "regexp": ".*", "targets": [`${domain}/app.ttl`] },
			{ "regexp": ".*/account/(.+)", "targets": [`${domain}/account/$1.ttl`], "isLast": true },
			{ "regexp": ".*/partition/(.+)", "targets": [`${domain}/accounts.ttl`, `${domain}/partition/$1.ttl`], "isLast": true },
		]
	}
}

export default config;
