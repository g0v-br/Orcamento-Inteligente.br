(function (window) {
    window.__dereferencingRules = [{ "regexp": ".*", "targets": ["http://localhost:8080/data.ttl"], "isLast": true }] ;
}(this));


// (function (window) {
//     LODMAP2D_DATA = "http://pub.linkeddata.center:29340/"
//     window.__dereferencingRules = [
//         { "regexp": ".*", "targets": [LODMAP2D_DATA + "app.ttl"] },
//         { "regexp": ".*/partition/(\\w+)$", "targets": [LODMAP2D_DATA + "partitions.ttl"], "isLast": true },
//         { "regexp": ".*/account/(\\w+)$", "targets": [LODMAP2D_DATA + "accounts.ttl", LODMAP2D_DATA + "account/$1.ttl"], "isLast": true },
//         { "regexp": ".*/(credits|terms)$", "targets": [LODMAP2D_DATA + "$1.ttl"], "isLast": true }
//     ];
// }(this));



// (function (window) {
//     LODMAP2D_DATA = "http://pub.linkeddata.center:29340/"
//     window.__dereferencingRules = [
//         { "regexp": /.*/, "targets": [LODMAP2D_DATA + "app.ttl"] },
//         { "regexp": /.*\/partition\/(\w+)$/, "targets": [LODMAP2D_DATA + "partitions.ttl"], "isLast": true },
//         { "regexp": /.*\/account\/(\w+)$/, "targets": [LODMAP2D_DATA + "accounts.ttl", LODMAP2D_DATA + "account/$1.ttl"], "isLast": true },
//         { "regexp": /.*\/(credits|terms)$/, "targets": [LODMAP2D_DATA + "$1.ttl"], "isLast": true }
//     ];
// }(this));
