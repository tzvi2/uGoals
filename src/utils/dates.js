export const dateFromString = (str) => {
    str = str.split("-")
    return new Date(str[0], str[1]-1, str[2])
}

export const getDaysBetween = (date1, date2) => {
    return Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24) )
}

export const dateStringToUS = (string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let day = parseInt(string.substring(8))
    let month = months[Number(string.substring(5, 7)) - 1]
    let year = string.substring(0, 4)
    return (`${month} ${day}, ${year}`)
}

export const getEarlierDate = (date1, date2) => {

}

export const getTimeRemaining = (deadlineStr) => {
    let result = ""
    let daysRemaining = getDaysBetween(new Date(deadlineStr), new Date())
    if (daysRemaining > 0 && daysRemaining < 22) {
        result = `${daysRemaining} days remaining`
    } else if (daysRemaining > 21 && daysRemaining < 91 ) {
        result = `${Math.round(daysRemaining / 7)} weeks remaining`
    } else if (daysRemaining > 91) {
        result = `${Math.round(daysRemaining / 30)} months remaining`
    }
   
}
