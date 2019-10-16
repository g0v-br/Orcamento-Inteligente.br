import $rdf from "rdflib";

export const store = $rdf.graph();
export const fetcher = new $rdf.Fetcher(store);
export const ns = {
	rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
	bgo: $rdf.Namespace('http://linkeddata.center/lodmap-bgo/v1#')
};


export function getDefaultMenuItems(parent) {
	let items = [];
	if (parent) {
		let array = store
			.each(parent, ns.bgo("withCustomMenuItem")).forEach(element => {
				let path = store.any(element, ns.bgo("link"));
				if (path != undefined) {
					items.push({
						title: store.anyValue(element, ns.bgo("title")) || "",
						icon: store.anyValue(element, ns.bgo("icon")) || "fas fa-bullseye",
						path: path.value,
						external: path.termType == "NamedNode"
					});
				}
			});
		return items;
	} else {
		return undefined;
	}
}


const formatNumber = (number, options) => {
	// console.log('number', number);
	let formattedAmount, res;
	if (isFinite(number)) {
		number = number * options.scaleFactor;
		if (number < options.minValue) {
			res = options.lessThanMinFormat;
		} else if (number > options.maxValue) {
			res = options.moreThanMaxFormat;
		} else {
			formattedAmount = new Intl.NumberFormat(undefined,
				{ maximumFractionDigits: options.precision })
				.format(number);
			res = options.format.replace("%s", formattedAmount);
		}
	} else {
		res = options.nanFormat;
	}
	return res;
}


export const getNumberFormatter = (formatter) => {
	if (formatter) {
		const options = {
			format: store.anyValue(formatter, ns.bgo("format")) || "%s",
			precision: store.anyValue(formatter, ns.bgo("precision")) || 2,
			nanFormat: store.anyValue(formatter, ns.bgo("nanFormat")) || "N/A",
			scaleFactor: store.anyValue(formatter, ns.bgo("scaleFactor")) || 1,
			maxValue: store.anyValue(formatter, ns.bgo("maxValue")) || Infinity,
			minValue: store.anyValue(formatter, ns.bgo("minValue")) || -Infinity,
			moreThanMaxFormat: store.anyValue(formatter, ns.bgo("moreThanMaxFormat")) || "%s",
			lessThanMinFormat: store.anyValue(formatter, ns.bgo("lessThanMinFormat")) || "%s"
		}

		return (number) => formatNumber(number, options)

	}
	return (number) => number;
}


export const getTotalizer = (subject, predicate) => {
	const totalizer = store.any(subject, predicate),
		rateFormatter = getNumberFormatter(store.any(totalizer, ns.bgo("ratioFormatter"))),
		filteredFormat = store.anyValue(totalizer, ns.bgo("filteredFormat")) || "%s",
		format = store.anyValue(totalizer, ns.bgo("format")) || "%s";
	let options = {
		precision: store.anyValue(totalizer, ns.bgo("precision")) || 2,
		nanFormat: store.anyValue(totalizer, ns.bgo("nanFormat")) || "N/A",
		scaleFactor: store.anyValue(totalizer, ns.bgo("scaleFactor")) || 1,
		maxValue: store.anyValue(totalizer, ns.bgo("maxValue")) || Infinity,
		minValue: store.anyValue(totalizer, ns.bgo("minValue")) || -Infinity,
		moreThanMaxFormat: store.anyValue(totalizer, ns.bgo("moreThanMaxFormat")) || "%s",
		lessThanMinFormat: store.anyValue(totalizer, ns.bgo("lessThanMinFormat")) || "%s"
	}

	return (total, filteredTotal) => {
		let formattedTotal;
		if (total == filteredTotal) {
			formattedTotal = formatNumber(total, {
				...options,
				format: format
			});
			return formattedTotal
		} else {
			let formattedRatio = rateFormatter(filteredTotal / total);
			formattedTotal = formatNumber(filteredTotal, {
				...options,
				format: filteredFormat
			});
			return formattedTotal + formattedRatio;
		}
	}
}


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


