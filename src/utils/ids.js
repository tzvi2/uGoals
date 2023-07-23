export const getRandomID = () => {
    let result = ""
    let stringLength = Math.floor(Math.random() * (12 - 6 + 1) + 4)
    let numberLength = Math.floor(Math.random() * (5 - 3 + 1) + 1)
    for (let i = 0; i < stringLength; i++) {
        let fiftyfifty = Math.floor(Math.random() * (2 - 1 + 1) + 1)
        let lowerRand = Math.floor(Math.random() * (90 - 48 + 1) + 48)
        let higherRand = Math.floor(Math.random() * (125 - 94 + 1) + 94)
        if (fiftyfifty === 1) {
            result += String.fromCharCode(lowerRand)
        } else {
            result += String.fromCharCode(higherRand)
        }    
    }
    for (let i = 1; i < numberLength + 1; i++) {
        let fiftyfifty = Math.floor(Math.random() * (2 - 1 + 1) + 1)
        let lowerRand = Math.floor(Math.random() * (90 - 48 + 1) + 48)
        let higherRand = Math.floor(Math.random() * (125 - 94 + 1) + 94)
        if (fiftyfifty === 1) {
            result += String.fromCharCode(lowerRand)
        } else {
            result += String.fromCharCode(higherRand)
        }
    }
    return result
}