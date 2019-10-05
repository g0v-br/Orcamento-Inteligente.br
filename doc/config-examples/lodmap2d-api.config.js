(function (window) {
	let namespace = "http://data.example.com";
	
	window.__dereferencingRules = [
		{ "regexp": "/", "targets": [`${namespace}/app.ttl`] },
		{ "regexp": "/partition/(\\w+)$", "targets": [`${namespace}/partitions.ttl`], "isLast": true  },
		{ "regexp": "/account/(\\w+)$", "targets": [`${namespace}/accounts.ttl`,`${namespace}/account/$1.ttl`], "isLast": true },
		{ "regexp": "/(credits|terms)$", "targets": [`${namespace}/$1.ttl`], "isLast": true },
	] ;
}(this));