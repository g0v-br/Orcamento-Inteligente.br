// export const formatPercentage = (rate, precision = 2) => {
//     if (isFinite(rate)) {
//         if (rate == 0)
//             return "0%";
//         return new Intl.NumberFormat(undefined, {
//             style: "percent",
//             maximumFractionDigits: precision
//         }).format(rate)
//     }
//     return "N/A";
// }

export const formatAmount = (amount, precision = 2) => {
    return new Intl.NumberFormat({ maximumFractionDigits: precision }).format(
        amount
    )
}

export const numberFormatter = (number, options = {precision: 2}) => {
    let formattedAmount, text;
    // console.log(number,options)
    if (!isFinite(number) || !number) {
        text = options.nanFormat || "N/A";
    } else {
        if(options.scaleFactor) {
            number = number * options.scaleFactor;

        }
        if (options.minValue && (number < options.minValue)) {
            text = options.lessThanMinFormat;
        } else if (options.maxValue && number > options.maxValue) {
            text = options.moreThanMaxFormat;
        } else {
            formattedAmount = new Intl.NumberFormat(undefined,
                { maximumFractionDigits: options.precision })
            .format(number);
            text = printf(options.format, formattedAmount);
        }
    }
    return text;
}

// Same as C/C++ solo per %s
export const printf = (format = "%s", ...args) => {
    let res = format;
    for (const s of args) {
        res = res.replace("%s", s);
    }
    return res;
}
