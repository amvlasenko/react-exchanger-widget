const GoExchange = (props) => {
   const {exchangeTo, exchangeError, exchangeErrorValue} = props;
   return (
      <div className="goExchange">
         <label htmlFor="exchangeAddress">
            Your {exchangeTo ? exchangeTo : 'Ethereum'} address
            <input
               type="text"
               className="exchangeAddress"
               id="exchangeAddress"
               aria-label="Enter exchange address"
            />
         </label>
         <button className="exchangeSubmit" aria-label="Make an exchange">
            Exchange
            <div className={exchangeError}>
              <span>
                {exchangeErrorValue === 'deposit_too_small'
                   ? 'Deposit too small'
                   : exchangeErrorValue === 'pair_is_inactive'
                      ? 'This pair is disabled now'
                      : 'Enter deposit'}
              </span>
            </div>
         </button>
      </div>
   );
};

export default GoExchange;