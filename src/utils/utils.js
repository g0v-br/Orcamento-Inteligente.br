export const formatPercentage = (rate, precision = 2) => {
    if (isFinite(rate)) {
        if (rate == 0)
            return "0%";
        return new Intl.NumberFormat(undefined, {
            style: "percent",
            maximumFractionDigits: precision
        }).format(rate)
    }
    return "N/A";
}

export const formatAmount = (amount, precision = 2) => {
    return new Intl.NumberFormat({ maximumFractionDigits: precision }).format(
        amount
    )
}

// Same as C/C++ solo per %s
export const printf = (format = "%s", ...args) => {
    let res = format;
    for (const s of args) {
        res = res.replace("%s", s);
    }
    return res;
}
