const should = require("should");
const td = require("testdouble");
const { Retry, RetryPolicies } = require("../src/utils/retry");

describe("Retry", () => {
    const error = Error("error");
    it("should callback as many times as possible", async () => {
        let i = 0;
        const start = Date.now();
        const logger = td.object(["log", "error"]);
        const retry = new Retry(4, 100, RetryPolicies.constant, logger);
        await (retry.retry(async () => { i++; throw error; })).should.be.rejectedWith(error);
        i.should.equal(4);
        (Date.now() - start).should.be.greaterThan(300);
        (Date.now() - start).should.be.below(400);
        td.verify(logger.error("error"), { times: 4 });
    });
    it("should stop retrying when process works", async () => {
        let i = 0;
        const logger = td.object(["log", "error"]);
        const start = Date.now();
        const retry = new Retry(4, 100, RetryPolicies.constant, logger);
        const result = await retry.retry(async () => { if (++i < 3) throw error; return 123 });
        i.should.equal(3);
        should(result).equal(123);
        (Date.now() - start).should.be.greaterThanOrEqual(200);
        (Date.now() - start).should.be.below(400);
    });

    it("should stop retrying exponentially", async () => {
        const logger = td.object(["log", "error"]);
        const start = Date.now();
        const retry = new Retry(4, 10, RetryPolicies.exponential, logger);
        await retry.retry(async () => { throw error; }).should.be.rejectedWith(error);
        (Date.now() - start).should.be.greaterThan(10 + 20 + 40);
        (Date.now() - start).should.be.below(85);
    });
});