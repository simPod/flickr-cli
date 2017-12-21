const getCommandClassName = (str) => {
    const output = str.replace(/\w/, (char, index) => index === 0 ? char.toUpperCase() : char);
    return output;
};

module.exports = getCommandClassName;