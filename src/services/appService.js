import { store, ns, getDefaultMenuItems } from "./rdfService";

console.log('fuori dal export in appService')


export default {
    getTitle: () => {
        const domain = store.any(undefined, ns.bgo("hasOverview"))
        console.log(domain);
        // let title = store.anyValue(domain, ns.bgo("label"))||
        // store.anyValue(domain, ns.bgo("title"))||
        // "LODMAP 2D";
        // console.log(store.anyValue(domain, ns.bgo("label")))
        // return title;
    },
    getNavigationMenu: () => {
        let navigation={
            overview:{},
            partition:{},
            otherNavigationItem:[]
        };
        let domain = store.any(undefined, ns.bgo("hasOverview"));
        let navigationNode=store.any(domain, ns.bgo("hasNavigationMenu"));
        let overview = store.any(domain, ns.bgo("hasOverview"));
        let credits = store.any(domain, ns.bgo("hasCredits"));
        let terms = store.any(domain, ns.bgo("hasTerms"));
        let tabview = store.any(domain, ns.bgo("hasTableView"));
        //overview for navigation menu
        navigation.overview["title"] = store.anyValue(overview, ns.bgo("label")) ||
            store.anyValue(overview, ns.bgo("title")) ||
            "Overview";
        navigation.overview["icon"] = store.anyValue(overview, ns.bgo("icon")) ;
        navigation.overview["path"] = "/";
        //partitions
        let partitionNode = store.any(overview, ns.bgo("hasPartitions"));
        let partitionList = store.any(partitionNode, ns.bgo("hasPartitionList"));
        navigation.partition["title"] = store.anyValue(partitionNode, ns.bgo("label")) ||
            store.anyValue(partitionNode, ns.bgo("title")) ||
            "Partitions";;
        navigation.partition["icon"] = store.anyValue(partitionNode, ns.bgo("icon")) ;
        navigation.partition["partitionList"] = [];
        if (partitionList && partitionList.elements.length != 0) {
            partitionList.elements.forEach(el => {
                navigation.partition.partitionList.push({
                    title: store.anyValue(el, ns.bgo("label")) || store.anyValue(el, ns.bgo("title")),
                    path: "/partition/" + store.anyValue(el, ns.bgo("partitionId"))
                });
            });
        } else {
            navigation.partition = undefined;
        }
        //other default links
        if (tabview) {
            navigation.otherNavigationItem.push({
                icon: store.anyValue(tabview, ns.bgo("icon"))||"fas fa-table",
                title: store.anyValue(tabview, ns.bgo("label")) || store.anyValue(tabview, ns.bgo("title")) || "Table",
                path: "/table"
            });
        }
        if (credits) {
            navigation.otherNavigationItem.push({
                icon: store.anyValue(credits, ns.bgo("icon"))||"fas fa-users",
                title: store.anyValue(credits, ns.bgo("label")) || store.anyValue(credits, ns.bgo("title")) || "Credits",
                path: "/credits"
            });
        }
        if (terms) {
            navigation.otherNavigationItem.push({
                icon: store.anyValue(terms, ns.bgo("icon"))||"fas fa-gavel",
                title: store.anyValue(terms, ns.bgo("label"))||store.anyValue(terms, ns.bgo("title"))|| "Terms & Conditions",
                path: "/terms"
            });
        }
        //other links
        if (navigationNode) {
            navigation.otherNavigationItem.push(...getDefaultMenuItems(optionNode));
        }

        return navigation
    },
    getSocialSharingMenu: () => {
        let socialSharing = {};
        let hasSocialSharing = store.any(domain, ns.bgo("hasSocialSharing"));
        let description = store.any(domain, ns.bgo("description"));
        let title = store.any(domain, ns.bgo("title"));
        let hashtag = store.any(domain, ns.bgo("hashtag"));
        //there is a social sharing menu?
        socialSharing["hasIt"] = hasSocialSharing
            ? Boolean(Number(socialSharing.value))
            : false;
        // titile
        socialSharing["title"] = title ? (title.value) : "LODMAP 2D";
        //description
        socialSharing["description"] = description ? (description.value) : "";
        //hashtag
        socialSharing["hashtag"] = hashtag ? (hashtag.value) : "#LODMAP2D";
        return socialSharing;
    },
    getOptionMenu: () => {
        let option = {}
        let optionNode = store.any(domain, ns.bgo("hasOptionMenu"));
        option["hasIt"] = optionNode != undefined
        if (option.hasIt) {
            option.optionItems = getDefaultMenuItems(optionNode);
            option.hasIt = option.optionItems.length > 0;
        }

        return option
    },
    getFooterMenu: () => {
        let footer = {};
        let footerNode = store.any(domain, ns.bgo("hasFooterMenu"));
        footer["hasIt"] = footerNode != undefined
        if (footer.hasIt) {
            footer.footerItems = getDefaultMenuItems(footerMenu);
            footer.copyright = store.any(domain, ns.bgo("hasCopyrigth")) || "(c) LinkedData.Center";
        }
        return footer;

    }
}