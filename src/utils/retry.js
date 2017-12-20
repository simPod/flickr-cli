const waitAsync = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), timeout);
    });
};

const RetryPolicies = {
    exponential: (currentTimout) => {
        return currentTimout * 2;
    },
    constant: (currentTimeout) => {
        return currentTimeout;
    }
};

class Retry {

    constructor(retryCount = 5, initialTimeout = 1000, retryPolicy = retryPolicies.constant, logger = console) {
        this.retryCount = retryCount;
        this.retryPolicy = retryPolicy;
        this.initialTimeout = initialTimeout;
        this.logger = logger;

        this.retry = this.retry.bind(this);
    }

    async retry (asyncCallback) {
        let timeout = this.initialTimeout;
        let i = 0;
        while (true) {
            try {
                const result = await asyncCallback();
                return result;
            } catch(error) {
                this.logger.error(error.message);
                if (++i >= this.retryCount)
                    throw error;
            }
            this.logger.log(`Retrying in ${timeout / 1000}s`);
            await waitAsync(timeout);
            timeout = this.retryPolicy(timeout);
        }
    };
}

module.exports = {
    Retry,
    RetryPolicies
};