/*
 * With these rules:
 *  - the route /account/xxx loads http://localhost:8000/app.ttl, http://localhost:8000/accounts.ttl and http://localhost:8000/account/xxx.ttl
 *  - the route /partition/overview loads loads http://localhost:8000/app.ttl and http://localhost:8000/partitions.ttl
 *  - the route /credits loads loads http://localhost:8000/app.ttl and http://localhost:8000/credits.ttl
 *  - ...
 *  
 *  Note that http://localhost:8000/app.ttl is always loaded (because "isLast": true is not present
 */
(function (window) {
	let namespace = "http://localhost:8000";
	
	window.__dereferencingRules = [
		{ "regexp": ".*", "targets": [`${namespace}/app.ttl`] },
		{ "regexp": ".*/partition/(\\w+)$", "targets": [`${namespace}/partitions.ttl`], "isLast": true  },
		{ "regexp": ".*/account/(\\w+)$", "targets": [`${namespace}/accounts.ttl`,`${namespace}/account/$1.ttl`], "isLast": true },
		{ "regexp": ".*/(credits|terms)$", "targets": [`${namespace}/$1.ttl`], "isLast": true },
	] ;
}(this));