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

    constructor(retryCount = 5, initialTimeout = 1000, retryPolicy = retryPolicies.constant) {
        this.retryCount = retryCount;
        this.retryPolicy = retryPolicy;
        this.initialTimeout = initialTimeout;

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
                if (++i >= this.retryCount)
                    throw error;
                console.error(error.message);
            }
            console.log(`Retrying in ${timeout / 1000}s`);
            await waitAsync(timeout);
            timeout = this.retryPolicy(timeout);
        }
    };
}

module.exports = {
    Retry,
    RetryPolicies
};