let ex = "https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/" ;

export default
{
	"dereferencingRules": [
		{ "regexp":".*" , "targets": [ ex+"/app.ttl"] } ,
		{ "regexp":"/account/(.+)" , "targets": [ ex+"/account/$1.ttl" ] , "isLast": true } ,
		{ "regexp":"/partition/(.+)" , "targets": [ ex+"/accounts.ttl", ex+"/partition/$1.ttl" ] , "isLast": true } ,
		{ "regexp":"/$" , "targets": [ ex+"/accounts.ttl", ex+"overview.ttl"] , "isLast": true } 
	]
}
