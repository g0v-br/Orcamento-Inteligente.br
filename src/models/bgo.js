import $rdf from "rdflib";

export const bgoStore = $rdf.graph();
export const fatcher = new $rdf.Fetcher(bgoStore);
export const ns = {
    rdf: Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    rdfs: Namespace('http://www.w3.org/2000/01/rdf-schema#'),
    bgo: Namespace('http://linkeddata.center/lodmap-bgo/v1#')
};

export function dref(uri){


}