import { store, ns, getDefaultMenuItems } from "./rdfService";

export default class AppService {
    constructor() {
        this.domain = store.any(null, ns.bgo("hasTableView"));
    }

    getTitle()
    {
        let title = store.anyValue(this.domain, ns.bgo("label"))||
        store.anyValue(this.domain, ns.bgo("title"))||
        "LODMAP 2D";
        return title;
    }
    getNavigationMenu()
    {
        let navigation={
            overview:{},
            partitions:{},
            tableViewNavigationItems:{},
            otherNavigationItems:[],
            defaultNavigationItems:[]
        };
        let navigationNode=store.any(this.domain, ns.bgo("hasNavigationMenu"));
        let overview = store.any(this.domain, ns.bgo("hasOverview"));
        let credits = store.any(this.domain, ns.bgo("hasCredits"));
        let terms = store.any(this.domain, ns.bgo("hasTerms"));
        let tabview = store.any(this.domain, ns.bgo("hasTableView"));
        //overview for navigation menu
        navigation.overview["title"] = store.anyValue(overview, ns.bgo("label")) ||
            store.anyValue(overview, ns.bgo("title")) ||
            "Overview";
        navigation.overview["icon"] = store.anyValue(overview, ns.bgo("icon")) ;
        navigation.overview["path"] = "/";
        //partitions
        let partitionsNode = store.any(overview, ns.bgo("hasPartitions"));
        let partitionsList =  store.each(partitionsNode, ns.bgo("hasPartition"));
        navigation.partitions["title"] = store.anyValue(partitionsNode, ns.bgo("label")) ||
            store.anyValue(partitionsNode, ns.bgo("title")) ||
            "Partitions";;
        navigation.partitions["icon"] = store.anyValue(partitionsNode, ns.bgo("icon")) ;
        navigation.partitions["partitionsList"] = [];
        if (partitionsList && partitionsList.length>0) {
            partitionsList.forEach(el => {
                navigation.partitions.partitionsList.push({
                    title: store.anyValue(el, ns.bgo("label")) || store.anyValue(el, ns.bgo("title")),
                    path: "/partition/" + store.anyValue(el, ns.bgo("partitionId"))
                });
            });
        } else {
            navigation.partitions = undefined;
        }
        //other default links
        if (tabview) {
            navigation.tableViewNavigationItems={
                icon: store.anyValue(tabview, ns.bgo("icon"))||"fas fa-table",
                title: store.anyValue(tabview, ns.bgo("label")) || store.anyValue(tabview, ns.bgo("title")) || "Table",
                path: "/table"
            };
        }
        if (credits) {
            navigation.defaultNavigationItems.push({
                icon: store.anyValue(credits, ns.bgo("icon"))||"fas fa-users",
                title: store.anyValue(credits, ns.bgo("label")) || store.anyValue(credits, ns.bgo("title")) || "Credits",
                path: "/credits"
            });
        }
        if (terms) {
            navigation.defaultNavigationItems.push({
                icon: store.anyValue(terms, ns.bgo("icon"))||"fas fa-gavel",
                title: store.anyValue(terms, ns.bgo("label"))||store.anyValue(terms, ns.bgo("title"))|| "Terms & Conditions",
                path: "/terms"
            });
        }
        //other links
        if (navigationNode) {
            navigation.otherNavigationItems.push(...getDefaultMenuItems(navigationNode));
        }
        //console.lo(navigation)
        return navigation
    }
    getSocialSharingMenu()
    {
        let socialSharing = {};
        let hasSocialSharing = store.anyValue(this.domain, ns.bgo("hasSocialSharing"));
        let description = store.any(this.domain, ns.bgo("description"));
        let title = store.any(this.domain, ns.bgo("title"));
        let hashtag = store.any(this.domain, ns.bgo("hashtag"));
        //there is a social sharing menu?
        socialSharing["hasIt"] = hasSocialSharing ? Boolean(Number(hasSocialSharing)) : false
        // titile
        socialSharing["title"] = title ? (title.value) : "LODMAP 2D";
        //description
        socialSharing["description"] = description ? (description.value) : "";
        //hashtag
        socialSharing["hashtag"] = hashtag ? (hashtag.value) : "#LODMAP2D";
        return socialSharing;
    }
    getOptionMenu() {
        let option = {}
        let optionNode = store.any(this.domain, ns.bgo("hasOptionMenu"));
        option["hasIt"] = optionNode != undefined
        if (option.hasIt) {
            option.optionItems = getDefaultMenuItems(optionNode);
            option.hasIt = option.optionItems.length > 0;
        }

        return option
    }
    getFooterMenu(){
        let footer = {};
        let footerNode = store.any(this.domain, ns.bgo("hasFooterMenu"));
        footer["hasIt"] = footerNode != undefined
        if (footer.hasIt) {
            footer.footerItems = getDefaultMenuItems(footerNode);
            footer.copyright = store.anyValue(this.domain, ns.bgo("hasCopyrigth")) || "(c) LinkedData.Center";
        }
        return footer;

    }
}