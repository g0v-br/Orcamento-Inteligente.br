import $rdf from "rdflib";

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


export function dref(uri) {
	let results = [];
	for (const rule of window.__dereferencingRules) {
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

	return results.length?results:uri;
}
