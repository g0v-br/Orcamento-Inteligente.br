import { store, ns, getNumberFormatter, getTotalizer } from "./rdfService";

const domain = store.any(undefined, ns.bgo("hasAccountView"));
const accountView = store.any(domain, ns.bgo("hasAccountView"));

export default {
    getAccountById: accountId => {
        // Meta
        const defaultVal = {
            value: "",
            datatype: "litteral"
        };
        // TODO sistemare la gestione delle stringe MD, per non usare oggetti per title description e abstract
        const account = store.any(null, ns.bgo("accountId"), accountId),
            title = store.any(account, ns.bgo("title")) || accountId || defaultVal,
            description = store.any(account, ns.bgo("description")) || defaultVal,
            abstract = store.any(account, ns.bgo("abstract")) || defaultVal,
            amount = parseFloat(store.anyValue(account, ns.bgo("amount"))) || 0,
            referenceAmount = parseFloat(store.anyValue(account, ns.bgo("referenceAmount"))) || 0,
            rate = (amount - referenceAmount) / referenceAmount;

        // Historic data
        const historicRecords = [];
        store.each(account, ns.bgo("hasHistoryRec")).forEach(rec => {
            historicRecords.push({
                version: store.anyValue(rec, ns.bgo("versionLabel")),
                amount: store.anyValue(rec, ns.bgo("amount"))
            })
        });

        // Breakdown data
        const breakDownRecords = [];
        store.each(account, ns.bgo("hasBreakdown")).forEach(br => {
            breakDownRecords.push({
                title: store.anyValue(br, ns.bgo("title")),
                amount: store.anyValue(br, ns.bgo("amount"))
            });
        });

        return {
            title,
            description,
            abstract,
            amount,
            rate,
            historicRecords,
            breakDownRecords
        }
    },


    getMetadataFormatter: () => {
        return {
            formatPercentage: getNumberFormatter(store.any(accountView, ns.bgo("trendFormatter"))),
            formatAmount: getNumberFormatter(store.any(accountView, ns.bgo("amountFormatter")))
        };
    },

    getHistoricPerspective: () => {
        const perspective = store.any(accountView, ns.bgo("hasHistoricalPerspective"));
        if (perspective) {
            return {
                title: store.anyValue(perspective, ns.bgo("title")) || "",
                formatters: {
                    formatAmount: getNumberFormatter(store.any(perspective, ns.bgo("amountFormatter")))
                }
            }
        }
        return null;
    },

    getBreakdownPerspective: () => {
        const perspective = store.any(accountView, ns.bgo("hasBreakdownPerspective"));
        if (perspective) {
            return {
                title: store.anyValue(perspective, ns.bgo("title")) || "",
                // Non utilizzato
                // formatters: {
                //     formatAmount: getNumberFormatter(store.any(perspective, ns.bgo("amountFormatter")))
                // },
                totalizer: getTotalizer(perspective, ns.bgo("hasTotalizer"))
            }
        }
        return null;
    }
}