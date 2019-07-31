import $rdf from "rdflib";

export const bgoStore = $rdf.graph();
export const fetcher = new $rdf.Fetcher(bgoStore);
export const ns = {
    rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    rdfs: $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#'),
    bgo: $rdf.Namespace('http://linkeddata.center/lodmap-bgo/v1#')
};

//TO DO
export function dref(uri){
    return "http://localhost:8080/sample.ttl"
}
