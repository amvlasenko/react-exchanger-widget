const API_KEY = 'bf09c6abbb5ec5bbbd0e210ad018ab010d460dc474c2e7361ccd27378e874a05'

export default new (class ServerAPI {
    async getCurrenies() {
        let promise = await fetch(
            `https://api.changenow.io/v1/currencies?active=true&fixedRate=true`
        );
        let response = await promise.json();
        return response;
    }

    async getMinAmount(exchangeFrom, exchangeTo) {
        let promise = await fetch(
            `https://api.changenow.io/v1/min-amount/${exchangeFrom}_${exchangeTo}?api_key=${API_KEY}`
        );
        let response = await promise.json();
        return response;
    }

    async getEstimatedAmount(inputFromValue, exchangeFrom, exchangeTo) {
        let promise = await fetch(
            `https://api.changenow.io/v1/exchange-amount/${inputFromValue}/${exchangeFrom}_${exchangeTo}?api_key=${API_KEY}`
        );
        let response = await promise.json();
        return response;
    }
})();
