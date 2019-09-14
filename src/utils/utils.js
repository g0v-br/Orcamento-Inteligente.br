export const formatPercentage = (rate, withSimbol = true) => {
    return new Intl.NumberFormat(undefined, {
        style: withSimbol ? "percent" : undefined,
        maximumFractionDigits: 2
    }).format(rate)
}

export const formatAmount = (amount, format = "%s") => {
    return format.replace("%s", new Intl.NumberFormat({ maximumFractionDigits: 2 }).format(
        amount
    ));
}

export const unformatAmount = (amount) => {
    let separator = new Intl.NumberFormat().format(1111).replace(/1/g, '');
    return amount.replace(new RegExp('\\' + separator, 'g'), '');
}