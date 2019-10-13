import { store, ns } from "./rdfService";
const domain = store.any(undefined, ns.bgo("hasCredits"));
const creditsView = store.any(domain, ns.bgo("hasCredits"));

export default function () {

    return {
        getData: () => {
            return {

                title: store.any(creditsView, ns.bgo("title")),
                abstract: store.any(creditsView, ns.bgo("abstract"))

            }
        },
        
    }
}