import { store, ns } from "./rdfService";
const domain = store.any(undefined, ns.bgo("hasTerms"));
const termsView = store.any(domain, ns.bgo("hasTerms"));

export default function () {

    return {
        getData: () => {
            return {
                title: store.anyValue(termsView, ns.bgo("title")) || "",
                abstract: store.anyValue(termsView, ns.bgo("abstract")) || ""
            }
        },

    }
}