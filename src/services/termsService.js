import { store, ns } from "./rdfService";
const domain = store.any(undefined, ns.bgo("hasTerms"));
const termsView = store.any(domain, ns.bgo("hasTerms"));

export default function () {

    return {
        getData: () => {
            return {

                title: store.any(termsView, ns.bgo("title")),
                abstract: store.any(termsView, ns.bgo("abstract"))

            }
        },

    }
}