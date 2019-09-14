export const formatPercentage = (rate, treshold = 0.01, tresholdPrintTemplate = "< 0.01%") => {

    if (isFinite(rate)) {
        if (rate < treshold)
            return tresholdPrintTemplate;
        return new Intl.NumberFormat(undefined, {
            style: "percent",
            maximumFractionDigits: 2
        }).format(rate)
    }
    return "N/A";
}

export const formatAmount = (amount, format = "%s") => {
    return format.replace("%s", new Intl.NumberFormat({ maximumFractionDigits: 2 }).format(
        amount
    ))
}