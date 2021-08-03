const API_KEY = process.env.REACT_APP_API_KEY;

export default new (class serverAPI {
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
