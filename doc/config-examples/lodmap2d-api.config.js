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
	const LODMAP2D_DATA = "http://localhost:8000";
	
	window.__dereferencingRules = [
        { "regexp": ".*", "targets": [LODMAP2D_DATA + "app.ttl"] },
        { "regexp": ".*/(table|partition|account).*$", "targets": [LODMAP2D_DATA + "accounts-index.ttl"] },
        { "regexp": ".*/table$", "targets": [LODMAP2D_DATA + "table-view.ttl"], "isLast": true },
        { "regexp": ".*/partition/(\\w+)$", "targets": [LODMAP2D_DATA + "partitions.ttl"], "isLast": true },
        { "regexp": ".*/account/(\\w+)$", "targets": [LODMAP2D_DATA + "account-view.ttl", LODMAP2D_DATA + "account/$1.ttl"], "isLast": true },
        { "regexp": ".*/(credits|terms)$", "targets": [LODMAP2D_DATA + "$1.ttl"], "isLast": true }
	] ;
}(this));