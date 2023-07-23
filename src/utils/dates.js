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

export const getDateStringsUntilDeadline = (date, period) => {
    date = new Date(date)
    let results = []
    let today = new Date()
    if (period === "day") {
        for (let i = 0; i <= getDaysBetween(today, date); i++) {
            let tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + i)
            results.push(tomorrow.toDateString())
        }
    } else if (period === "week") {
        while (today.getTime() <= date.getTime()) {
            results.push(today.toDateString())
            today.setDate(today.getDate() + 7)
        }
    } else {
        // add case for >30<
        while (today.getTime() <= date.getTime()) {
            results.push(today.toDateString())
            today.setDate(today.getDate() + 30)
        }
    }
    return results
}

export const getMonthAndDay = (string) => {
    return string.slice(4, 10)
}

export const dateInOneWeek = () => {
    let today = new Date()
    return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
}

export const dateInOneMonth = () => {
    let today = new Date()
    return new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
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

export const getCalendarComposition = (daysTillDeadline) => {
    let years = 0
    let months = 0
    let weeks = 0
    let days = 0
    while (daysTillDeadline > 364) {
        years += 1
        daysTillDeadline -= 365
    }
    while (daysTillDeadline > 29) {
        months += 1
        daysTillDeadline -= 30
    }
    while (daysTillDeadline > 6) {
        weeks += 1
        daysTillDeadline -= 7
    }
    while (daysTillDeadline > 0) {
        days += 1
        daysTillDeadline -= 1
    }
    let yearString = years === 0 ? "" : years === 1 ? "1 year" : `${years} years`
    let monthString = months === 0 ? "" : months === 1 ? "1 month" : `${months} months`
    let weekString = weeks === 0 ? "" : weeks === 1 ? "1 week" : `${weeks} weeks`
    let dayString = days === 0 ? "" : days === 1 ? "1 day" : `${days} days`
    return `${yearString} ${monthString} ${weekString} ${dayString}`
}

export const getCurrentStart = (action, period) => {
    let today = new Date()
    // * * * 
    //test: today.setDate(today.getDate() + 3)
    // * * * 
    if (period === "day") {
        return today.toDateString()
    }
    else if (period === "week") {
        for (let i = 0; i < 7; i++ ) {
            today.setDate(today.getDate() - i)
            if (action[today.toDateString()]) {
                return today.toDateString()
            }
            today = new Date()
        } 
    }
    else {
        for (let i = 0; i < 30; i++) {
            today.setDate(today.getDate() - i)
            if (action[today.toDateString()]) {
               return today.toDateString()
            }
            today = new Date()
        }
    }
}