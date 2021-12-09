export const joinSpacedString = (str) => {
    return str.split(" ").join("")
}

export const cleanUrl = (str) => {
    return str.split("%20").join(" ")
}

export const removeTrailingWhiteSpace = (str) => {
    let lastChar = str.length 
    while (str[lastChar - 1] === " ") {
        lastChar--
    }
  return str.substring(0, lastChar)
}