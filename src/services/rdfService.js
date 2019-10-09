import $rdf from "rdflib";
import config from '@/defaults.js';

export const bgoStore = $rdf.graph();
export const fetcher = new $rdf.Fetcher(bgoStore);
export const ns = {
	rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
	rdfs: $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#'),
	bgo: $rdf.Namespace('http://linkeddata.center/lodmap-bgo/v1#')
};
/**
return an array og DefaultMenuItem
@param a menu object
*/
export function getDefaultMenuItems(parent) {
	let items = [];
	if (parent) {
		bgoStore
			.any(parent, ns.bgo("withCustomMenuItems"))
			.elements.forEach(element => {
				let path = bgoStore.any(element, ns.bgo("link"));

				items.push({
					title: bgoStore.any(element, ns.bgo("title")) || "",
					icon: bgoStore.any(element, ns.bgo("icon")) || "fas fa-bullseye",
					path: path.value,
					external: path.termType == "NamedNode"
				});
			});
		return items;
	} else {
		return undefined;
	}
}


export function dref(uri, rules = config.dereferencingRules) {
	const results = [];
	// default match
	rules.push({ "regexp": uri, "targets": [uri] })
	for (const rule of rules) {
		const re = RegExp(rule.regexp);
		if (re.test(uri)) {
			rule.targets.forEach(target => {
				results.push(uri.replace(re, target));
			});

			if (rule.isLast) {
				return results;
			}
		}
	}

	return results;
}

/*
// pseudocodice: per maggiori informazioni si veda anche /README.md al capitolo "Personalizzazione dei dati"

Si presume che la variabile $dereferencingRules contenga qualcosa tipo:

{
	"dereferencingRules": [
		{ "regexp":".*" , "targets": [ "http://example.com/app.ttl"] } ,
		{ "regexp":"/account/(.+)" , "targets": [ "http://example.com/account/$1.ttl" ] , "isLast": true } ,
		{ "regexp":"/partition/(.+)" , "targets": [ "http://example.com/accounts.ttl", "http://example.com/partition/$1.ttl" ] , "isLast": true } ,
	]
}


la chiamata di dref( "http:/qualsiasicosa/partition/pippo") deve ritornare:
	[
		"http://example.com/app.ttl",
		"http://example.com/accounts.ttl",
		"http://example.com/partition/pippo.ttl"
	]


la chiamata di dref( "/partition/overview") deve ritornare:
	[
		"http://example.com/app.ttl",
		"http://example.com/accounts.ttl",
		"http://example.com/partition/overview.ttl"
	]


la chiamata di dref( "/nonesiste") deve ritornare:
	[
		"/nonesiste"
		"http://example.com/app.ttl"
	]

function dref( String $uri): array
{
	$results = [];
	$config = include "/config.js";

	//aggiungo l'ultima regola standard che matcha sempre
	$dereferencingRules = $config->dereferencingRules + { "regexp": $uri , "targets": [ $uri ] } ;


	foreach( $config->dereferencingRules a $rule ) {
		$pattern = '%'.$rule->regexp.'%';
		if( preg_matches ($pattern, $uri, $matches ) {
			// se il pattern matcha l'uri, per ogni target nella regola vengono
			// sostituiti gli id di gruppo della reghex ($1,$2 etc)
			// in javascript abbiamo visto che esiste una funzione che fa prorpio questo
			foreach( $rule->regexp as $target) {
				$newtarget = preg_replace( "/\$1/",$matches[1], $newtarget);
				$newtarget = preg_replace( "/\$2/",$matches[2], $newtarget);
				$newtarget = preg_replace( "/\$3/",$matches[3], $newtarget);
				$newtarget = preg_replace( "/\$4/",$matches[4], $newtarget);
				$newtarget = preg_replace( "/\$5/",$matches[5], $newtarget);
				...

				// aggiunge $newtarget ai risultati (push)
				$results[]=$newtarget
			}
			if ($rule->isLast) break; // exit foreach loop, ignora le regole successive
		}
	}

	return $results
}
*/