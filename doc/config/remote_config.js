//dep = data source end poin
let dep = "https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/depamples/" ;

export default
{
	"dereferencingRules": [
		{ "regdepp":".*" , "targets": [ dep+"/app.ttl"] } ,
		{ "regdepp":"/account/(.+)" , "targets": [ dep+"/account/$1.ttl" ] , "isLast": true } ,
		{ "regdepp":"/partition/(.+)" , "targets": [ dep+"/accounts.ttl", dep+"/partition/$1.ttl" ] , "isLast": true } ,
		{ "regdepp":"/$" , "targets": [ dep+"/accounts.ttl", dep+"overview.ttl"] , "isLast": true } 
	]
}
