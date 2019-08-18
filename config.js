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


export default
	{
		"dereferencingRules": [
			{ "regexp": ".*", "targets": ["http://example.com/app.ttl"] },
			{ "regexp": ".*/account/(.+)", "targets": ["http://example.com/account/$1.ttl"], "isLast": true },
			{ "regexp": ".*/partition/(.+)", "targets": ["http://example.com/accounts.ttl", "http://example.com/partition/$1.ttl"], "isLast": true },
		]
	}