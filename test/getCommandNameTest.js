const should = require("should");
const getCommandClassName = require("../src/utils/getCommandClassName");

describe("Inferring command class from its name", () => {
   it("should capitalize first letter", () => {
       const input = "testCommand";
       const expectedOutput = "TestCommand";

       const actualOutput = getCommandClassName(input);

       actualOutput.should.be.equal(expectedOutput);
   });
});