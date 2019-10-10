import { store, ns, getNumberFormatter, getTotalizer } from "./rdfService";

const domain = store.any(null, ns.bgo("hasTableView"));
const tableView = store.any(domain, ns.bgo("hasTableView"));


export default {

    getHeaders: () => {
        return [
            {
                text: store.anyValue(tableView, ns.bgo("headerTitle")) || "",
                value: "title",
                width: "45%"
            },
            {
                //unserachable
                text: store.anyValue(tableView, ns.bgo("headerAmount")) || "",
                value: "amount",
                width: "15%",
                filter: () => true
            },
            {
                //unserachable
                text: store.anyValue(tableView, ns.bgo("headerTrend")) || "",
                value: "trend",
                width: "15%",
                filter: () => true
            },
            {
                text: store.anyValue(tableView, ns.bgo("headerDescription")) || "",
                value: "description",
                width: "25%"
            }
        ];
    },

    getSearchPane: () => {
        const searchPane = store.any(tableView, ns.bgo("hasSearchPane"));
        return {
            label: store.anyValue(searchPane, ns.bgo("label")) || ""
        }
    },

    getAccounts: () => {
        const accounts = store.each(null, ns.bgo("accountId"));
        return accounts.map(account => {
            const title = store.anyValue(account, ns.bgo("title")) || "",
                accountId = store.anyValue(account, ns.bgo("accountId")) || "",
                amount = parseFloat(store.anyValue(account, ns.bgo("amount"))) || 0,
                previousValue = parseFloat(store.anyValue(account, ns.bgo("referenceAmount"))) || 0,
                trend = (amount - previousValue) / previousValue,
                description = store.anyValue(account, ns.bgo("description")) || "";
            return {
                accountId,
                title,
                amount,
                trend,
                description
            }
        });
    },

    getFormatters: () => {
        return {
            formatPercentage: getNumberFormatter(store.any(tableView, ns.bgo("trendFormatter"))),
            formatAmount: getNumberFormatter(store.any(tableView, ns.bgo("amountFormatter")))
        }
    },

    getTotalizer: () => {
        return getTotalizer(tableView, ns.bgo('hasTotalizer'))
    }


}