export const roundToPointFive = (num) => {
    num = Math.round(num * 10) / 10
    if (!String(num).includes(".")) {
        return num
    }
    let fractionalNum = Number(String(num).charAt(String(num).length - 1))
    if (fractionalNum === 5) {
        return num
    } else if (fractionalNum < 3) {
        num = Math.round(num)
    } else if (fractionalNum < 8) {
        num = Math.floor(num) + 0.5
    } else {
        num = Math.round(num)
    }
    return num
}

export const getFraction = (dividend, divisor) => {
    let decimalStr = (dividend / divisor).toFixed(2)
    let fraction = (Number(decimalStr) * 100).toFixed()
    return fraction + "%"
}

