import { store, ns, getNumberFormatter, getTotalizer } from "./rdfService";



export default function () {
    const domain = store.any(null, ns.bgo("hasOverview"));
    const overview = store.any(domain, ns.bgo("hasOverview"));

    return {
        getSearchPane: () => {
            const searchPane = store.any(overview, ns.bgo("hasSearchPane"));
            return {
                label: store.anyValue(searchPane, ns.bgo("label")) || ""
            };
        },

        getTotalizer: () => {
            return getTotalizer(overview, ns.bgo("hasTotalizer"));
        },

        getTagCloud: () => {
            const tagCloud = store.any(overview, ns.bgo("hasTagCloud"));

            return store.each(tagCloud, ns.bgo("hasTag")).map(tag => {
                const label = store.anyValue(tag, ns.bgo("label")),
                    weight = store.anyValue(tag, ns.bgo("tagWeight"));
                return {
                    label,
                    weight
                };
            });

        },
        getMetadata: () => {
            return {
                description: store.anyValue(domain, ns.bgo("description")) || "",
                abstract: store.anyValue(domain, ns.bgo("abstract")) || "",
            }
        },

        getLegendData: () => {
            const colorScheme = store.any(overview, ns.bgo("hasTrendColorScheme")),
                title = store.anyValue(colorScheme, ns.bgo("title")) || "",
                noTrendColor = store.anyValue(colorScheme, ns.bgo("noTrendColor")) || "";

            let rangeTresholds = [];
            let colorTresholds = [];

            const rateTreshold = store
                .each(colorScheme, ns.bgo("rateTreshold"))
                .sort((tresholdA, tresholdB) => {
                    let rateA = store.anyValue(tresholdA, ns.bgo("rate"));
                    let rateB = store.anyValue(tresholdB, ns.bgo("rate"));
                    return rateA - rateB;
                });

            rateTreshold.forEach(treshold => {
                rangeTresholds.push(
                    store.anyValue(treshold, ns.bgo("rate"))
                );
                colorTresholds.push(
                    store.anyValue(treshold, ns.bgo("colorId"))
                );
            });

            return {
                title,
                noTrendColor,
                colorTresholds,
                rangeTresholds
            };
        },

        getPartitions: function () {
            const partitionsNode = store.any(overview, ns.bgo("hasPartitions"));

            const partitions = store.each(partitionsNode, ns.bgo("hasPartition"))
                .sort((partitionA, partitionB) => {
                    //TODO sort
                    return partitionA.value.localeCompare(partitionB.value);
                })
                .map(partition => {
                    const subsets = this.getSubsets(partition);
                    const id = store.anyValue(partition, ns.bgo("partitionId")),
                        label = store.anyValue(partition, ns.bgo("label")) || "",
                        title = store.anyValue(partition, ns.bgo("title")) || "",
                        sortOrder = store.anyValue(partition, ns.bgo("withSortOrder")) || ns.bgo("descending_sort").value,
                        sortCriteria = store.anyValue(partition, ns.bgo("withSortCriteria")) || ns.bgo("abs_sort").value;
                    let groupFunction = store.any(partition, ns.bgo("withGroupFunction"))
                    let groupFunctionValue = groupFunction ? store.any(groupFunction, ns.rdf("type")).value : ns.bgo("AmountsSum").value;
                    const totalizerNode = store.any(groupFunction, ns.bgo("hasTotalizer"))
                    let totalizer;
                    if (groupFunction)
                        totalizer = getTotalizer(groupFunction, ns.bgo("hasTotalizer"), store.anyValue(groupFunction, ns.rdf("type")));
                    else
                        totalizer = getTotalizer(groupFunction, ns.bgo("hasTotalizer"), ns.bgo("AmountSum").value);
                    let formatCount;
                    let formatAmount;
                    let formatPercentage;
                    if (groupFunction) {
                        formatCount = getNumberFormatter(undefined);
                        formatAmount = getNumberFormatter(totalizerNode);
                        formatPercentage = getNumberFormatter(store.any(totalizerNode, ns.bgo("ratioFormatter")));
                    } else {
                        formatCount = formatAmount = formatPercentage = getNumberFormatter(undefined);
                    }
                    return {
                        id,
                        label,
                        title,
                        sortOrder,
                        sortCriteria,
                        groupFunction: groupFunctionValue,
                        subsets,
                        totalizer,
                        formatCount,
                        formatAmount,
                        formatPercentage,


                    }

                });

            partitions.unshift({
                id: "overview",
                label: store.anyValue(overview, ns.bgo("label")) || ""
            });

            return partitions;
        },

        getSubsets: function (partition) {
            const subsets = store.each(partition, ns.bgo("hasAccountSubSet"))
                .map(subset => {
                    const title = store.anyValue(subset, ns.bgo("title")) || "",
                        label = store.anyValue(subset, ns.bgo("label")) || "",
                        description = store.anyValue(subset, ns.bgo("description")) || "",
                        abstract = store.anyValue(subset, ns.bgo("abstract")) || "";



                    return {
                        id: subset.value,
                        title,
                        description,
                        abstract,
                        label,
                        amountTotal_filtered: 0,
                        amountTotal: 0, /* Somma degli amount filtrati */
                        referenceAmountTotal: 0,  /* Somma degli referenceAmount filtrati */
                        referenceAmountTotal_filtered: 0,  /* Somma degli referenceAmount filtrati */
                        count: 0, /* Numero di bolle */
                        count_filtered: 0, /* Numero di bolle */

                        formattedString: "" /* Stringa da stampare direttamente nell'interfaccia */
                    };
                });
            subsets.push(this.getDefautSubset(partition));
            // console.log(subsets);
            return subsets;

        },

        getDefautSubset: (partition) => {
            let label,
                title,
                defaultSubset = store.any(partition, ns.bgo("hasDefaultAccountSubSet"));
            if (defaultSubset !== undefined) {
                label = store.anyValue(defaultSubset, ns.bgo("label")) || "";
                title = store.anyValue(defaultSubset, ns.bgo("title")) || "";
            }
            return {
                id: "default",
                title, //TODO "Unassigned", sistemare lo string formatter in modo che gestica le stringhe non gli oggetti
                description: "",
                abstract: undefined,
                label,
                amountTotal: 0, /* Somma degli amount filtrati */
                referenceAmountTotal: 0,  /* Somma degli referenceAmount filtrati */
                count: 0, /* Numero di bolle */

                formattedString: "" /* Stringa da stampare direttamente nell'interfaccia */
            };
        },

        getFormatters: () => {
            const tooltip = store.any(overview, ns.bgo("hasTooltip"));
            return {
                //TODO: to change
                formatTooltipPercentage: getNumberFormatter(store.any(tooltip, ns.bgo("trendFormatter"))),
                formatTooltipAmount: getNumberFormatter(store.any(tooltip, ns.bgo("amountFormatter"))),
                formatLegendPercentage: getNumberFormatter(store.any(tooltip, ns.bgo("trendFormatter"))),
            };
        },

        getAccounts: function () {
            const accounts = store.each(null, ns.bgo("accountId"));
            return accounts.map(account => {

                let partitions = {};
                const partTable = this.getPartitions();
                partTable.slice(1).forEach(p => {
                    partitions[p.id] = "default";
                })
                let subSetUris = store.each(undefined, ns.bgo("hasAccount"), account);
                subSetUris.forEach(subSetUri => {
                    let partition = store.any(undefined, ns.bgo("hasAccountSubSet"), subSetUri);
                    let partitionId = store.anyValue(partition, ns.bgo("partitionId"))
                    const isPartitionPresent = partTable.some(p => p.id == partitionId);
                    if (isPartitionPresent)
                        partitions[partitionId] = subSetUri.value;
                });

                const title = store.anyValue(account, ns.bgo("title")) || "",
                    id = store.anyValue(account, ns.bgo("accountId")) || "",
                    amount = parseFloat(store.anyValue(account, ns.bgo("amount"))) || 0,
                    refAmount = parseFloat(store.anyValue(account, ns.bgo("referenceAmount"))) || 0,
                    rate = isFinite((amount - refAmount) / refAmount) ? (amount - refAmount) / refAmount : NaN,
                    description = store.anyValue(account, ns.bgo("description")) || "",
                    abstract = store.anyValue(account, ns.bgo("abstract")) || "",
                    bg = store.anyValue(account, ns.bgo('depiction')) || null;

                return {
                    id,
                    title,
                    amount,
                    refAmount,
                    rate,
                    description,
                    abstract,
                    bg,
                    partitions
                };
            });
        },

        getCriteria() {
            let criteria = {}
            criteria["TrendAverage"] = ns.bgo("TrendAverage").value;
            criteria["AmountsSum"] = ns.bgo("AmountsSum").value;
            criteria["AccountsCount"] = ns.bgo("AccountsCount").value;
            criteria["abs_sort"] = ns.bgo("abs_sort").value;
            criteria["natural_sort"] = ns.bgo("natural_sort").value;
            criteria["ascending_sort"] = ns.bgo("ascending_sort").value;
            criteria["descending_sort"] = ns.bgo("descending_sort").value;
            return criteria;
        }

    };
}


