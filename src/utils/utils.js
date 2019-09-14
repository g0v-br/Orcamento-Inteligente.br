export const formatPercentage = (rate, precisionTreshold = 0.00005) => {

    if (isFinite(rate)) {
        if (rate == 0)
            return "0%";
        if (Math.abs(rate) < precisionTreshold) {
            return new Intl.NumberFormat(undefined, {
                style: "percent",
                maximumSignificantDigits: 2
            }).format(rate)
        }
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


// Same as C/C++ solo per %s
export const printf = (format = "%s", ...args) => {
    let res = format;
    for (const s of args) {
        res = res.replace("%s", s);
    }
    return res;
}