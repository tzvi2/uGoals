export const objectIsEmpty = (obj) => {
    if (obj && Object.keys(obj).length === 0
    && Object.getPrototypeOf(obj) === Object.prototype) {
        return false
    }
    return true
}