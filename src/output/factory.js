module.exports = class {
    constructor() {
        this.getOutput = this.getOutput.bind(this);
        this.getConsoleOutput = this.getConsoleOutput.bind(this);
    }

    getOutput() {
        return this.getConsoleOutput();
    }

    getConsoleOutput() {
        return (strArray) => strArray.forEach((str) => console.log(str));
    }
}