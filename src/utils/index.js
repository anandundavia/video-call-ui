export const isResponseGood = response => 200 < response && response < 400;

export const hasOnlyNumbers = (number, { allowSpaces }) => {
    if (allowSpaces) {
        return /[0-9+]$/.test(number);
    }
    return /[0-9+ ]/.test(number);
};

export const sanitizeMobileNumber = mobileNumber => {
    return mobileNumber
        .trim()
        .split(" ")
        .join("");
};
