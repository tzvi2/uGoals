export const dateFromString = (str) => {
    str = str.split("-")
    console.log(new Date(str[0], str[1]-1, str[2]))
}

export const getDaysBetween = (date1, date2) => {
    return Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24) + 1)
}

