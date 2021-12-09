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

export const roundToPointTwoFive = (num) => {
    let res = num.toFixed(2)

    let beforeDecimal = parseInt(Number(res).toFixed(0))
    let afterDecimal = Number(res.substring(res.length, res.length - 2))

    if (afterDecimal === 50 || afterDecimal === 25 || afterDecimal === 75 || afterDecimal === 0) {
        return res
    }
  
    if (afterDecimal < 13) {
      afterDecimal = 0
    } else if (afterDecimal < 38) {
      afterDecimal = .25
    } else if (afterDecimal < 63) {
      afterDecimal = .50
    } else if (afterDecimal < 88) {
      afterDecimal = .75
    } else {
      afterDecimal = 0
      beforeDecimal += 1
    }
  
    return beforeDecimal + afterDecimal
  }

export const getFraction = (dividend, divisor) => {
    let decimalStr = (dividend / divisor).toFixed(2)
    let fraction = (Number(decimalStr) * 100).toFixed()
    return fraction + "%"
}

