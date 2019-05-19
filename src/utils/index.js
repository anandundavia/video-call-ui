export const isResponseGood = response => 200 < response && response < 400;

export const isValidEmailAddress = emailAddress => {
	const regex = /\S+@\S+/;
	return regex.test(emailAddress);
};

export const sanitizeMobileNumber = mobileNumber => {
	return mobileNumber
		.trim()
		.split(" ")
		.join("");
};

export const isGmailAddress = emailAddress => {
	const regex = /\S+@gmail.com/;
	return regex.test(emailAddress);
};

export const getLargerDimension = () => {
	return {
		size: window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth,
		name: window.innerHeight > window.innerWidth ? "height" : "width"
	};
};

export const getSmallerDimension = () => {
	return {
		size: window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth,
		name: window.innerHeight > window.innerWidth ? "height" : "width"
	};
};
