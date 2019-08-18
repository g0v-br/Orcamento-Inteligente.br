//Pseudo codice da implementare
//if GETENV('LODMAP2D_DATA')
//	$dep=GETENV('LODMAP2D_DATA')
//	
//export default
//{
//	"dereferencingRules": [
//		{ "regdepp":".*" , "targets": [ dep+"/app.ttl"] } ,
//		{ "regdepp":"/account/(.+)" , "targets": [ dep+"/account/$1.ttl" ] , "isLast": true } ,
//		{ "regdepp":"/partition/(.+)" , "targets": [ dep+"/accounts.ttl", dep+"/partition/$1.ttl" ] , "isLast": true } ,
//		{ "regdepp":"/$" , "targets": [ dep+"/accounts.ttl", dep+"overview.ttl"] , "isLast": true } 
//	]
//}	
//else


export default
{
	"dereferencingRules": [
		{ "regexp":".*" , "tagets": [ "/sample.ttl"] , "isLast": true }
	]
}