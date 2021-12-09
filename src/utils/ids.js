export const getRandomID = () => {
    let stringLength = Math.floor(Math.random() * (12 - 6 + 1) + 4)
    let numberLength = Math.floor(Math.random() * (5 - 3 + 1) + 1)
    let letterString = ""
    let numberString = ""
    for (let i = 0; i < stringLength; i++) {
        let randomNum = Math.floor(Math.random() * (126 - 58 + 1)) + 58
        letterString += String.fromCharCode(randomNum)
    }
    for (let i = 1; i < numberLength + 1; i++) {
        let randomNum = Math.floor(Math.random() * (126 - 58 + 1)) + 58
        numberString += Math.round(randomNum * i)
    }
    return `${letterString}${numberString}`
}