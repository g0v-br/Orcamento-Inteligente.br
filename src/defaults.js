import config from "./../config.js"
export default
{
	"minBorder": 3, // in pixel
	"minRadius": 2, //in pixel
	"velocityDecady": 0.2,
	"forceStrength": 0.03 ,
	"dereferencingRules": [{ "regexp":".*" , "tagets": [ "/sample.ttl"] }],
	...config
}
