export const formatPercentage = (rate, withSimbol = true) => {
    return new Intl.NumberFormat(undefined, {
        style: withSimbol ? "percent" : undefined,
        maximumFractionDigits: 2
    }).format(rate)
}