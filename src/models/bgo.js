import $rdf from "rdflib";

export const bgoStore = $rdf.graph();
export const fetcher = new $rdf.Fetcher(bgoStore);
export const ns = {
	rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
	rdfs: $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#'),
	bgo: $rdf.Namespace('http://linkeddata.center/lodmap-bgo/v1#')
};

export function dref(uri) {
	const results = [];
	for (const rule of window.__dereferencingRules) {
		const re = RegExp(rule.regexp);
		if (re.test(uri)) {
			rule.targets.forEach(target => {
				let replacedTarget = uri.replace(re, target)
				results.push(replacedTarget);
			});

			if (rule.isLast) {
				return results;
			}
		}
	}

	return results.length ? results : uri;
}
