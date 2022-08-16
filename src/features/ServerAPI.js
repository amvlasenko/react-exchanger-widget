const API_KEY = 'bf09c6abbb5ec5bbbd0e210ad018ab010d460dc474c2e7361ccd27378e874a05';

export default new (class ServerAPI {
   async getCurrencies() {
      return await fetch(
         `https://api.changenow.io/v1/currencies?active=true&fixedRate=true`
      )
         .then((response => response.json()))
         .catch(err => err);
   }

   async getMinAmount(exchangeFrom, exchangeTo) {
      return await fetch(
         `https://api.changenow.io/v1/min-amount/${exchangeFrom}_${exchangeTo}?api_key=${API_KEY}`
      )
         .then((response => response.json()))
         .catch(err => err);
   }

   async getEstimatedAmount(inputFromValue, exchangeFrom, exchangeTo) {
      return await fetch(
         `https://api.changenow.io/v1/exchange-amount/${inputFromValue}/${exchangeFrom}_${exchangeTo}?api_key=${API_KEY}`
      )
         .then((response => response.json()))
         .catch(err => err);
   }
})();
