import { store, ns } from "./rdfService";
const domain = store.any(undefined, ns.bgo("hasCredits"));
const creditsView = store.any(domain, ns.bgo("hasCredits"));

export default function () {

    return {
        getData: () => {
            return {

                title: store.anyValue(creditsView, ns.bgo("title")) || "",
                abstract: store.anyValue(creditsView, ns.bgo("abstract")) || ""

            }
        },
        
    }
}