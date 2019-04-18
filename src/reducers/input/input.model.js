export const sanitizeMobileNumber = mobileNumber => {
    return mobileNumber
        .trim()
        .split(" ")
        .join("");
};

export const isMobileNumberValid = mobileNumber => {
    const regex = /[0-9 ]{6}/;
    return regex.test(mobileNumber);
};
