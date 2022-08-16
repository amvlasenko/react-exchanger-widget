import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ServerAPI from '../features/ServerAPI';
import {
   fetchCurrencies,
   fetchEstimatedAmount,
   fetchMinimalAmount,
   setExchangeFrom,
   setExchangeTo,
} from '../redux/actions';
import Search from './Search';
import GoExchange from './GoExchange';

function Widget() {
   const dispatch = useDispatch();
   const currencies = useSelector((state) => state.currencies.currencies);
   const exchangeFrom = useSelector((state) => state.setExchange.exchangeFrom);
   const exchangeTo = useSelector((state) => state.setExchange.exchangeTo);
   const minimalAmount = useSelector(
      (state) => state.minimalAmount.minimalAmount
   );
   const estimatedAmount = useSelector(
      (state) => state.estimatedAmount.estimatedAmount
   );

   const [inputFromValue, setInputFromValue] = useState('');
   const [inputToValue, setInputToValue] = useState('');
   const [searchFromIsOpened, setSearchFromIsOpened] = useState(false);
   const [searchToIsOpened, setSearchToIsOpened] = useState(false);
   const [searchFromStringValue, setSearchFromStringValue] = useState('');
   const [searchToStringValue, setSearchToStringValue] = useState('');
   const [exchangeError, setExchangeError] = useState(false);
   const [exchangeErrorValue, setExchangeErrorValue] = useState('');

   const buildWidget = useCallback(() => {
      dispatch(fetchCurrencies());
      dispatch(fetchMinimalAmount(exchangeFrom.ticker, exchangeTo.ticker));
   }, [dispatch, exchangeFrom, exchangeTo]);

   useEffect(() => {
      buildWidget();
   }, [buildWidget]);

   useEffect(() => {
      if (inputFromValue) {
         dispatch(fetchEstimatedAmount(
            inputFromValue,
            exchangeFrom.ticker,
            exchangeTo.ticker
         ));
      }
   }, [inputFromValue]);

   useEffect(() => {
      dispatch(fetchMinimalAmount(exchangeFrom.ticker, exchangeTo.ticker));
   }, [dispatch, exchangeFrom, exchangeTo]);

   useEffect(() => {
      setExchangeError(minimalAmount.error ? true : false);
      setExchangeErrorValue(minimalAmount.error ? minimalAmount.error : '');
      setInputFromValue(minimalAmount.error ? 0 : minimalAmount.minAmount);
   }, [minimalAmount]);

   useEffect(() => {
      setExchangeError(estimatedAmount.estimatedAmount ? false : true);
      setExchangeErrorValue(
         estimatedAmount.estimatedAmount ? '' : estimatedAmount.error
      );
      setInputToValue(
         estimatedAmount.estimatedAmount ? estimatedAmount.estimatedAmount : '-'
      );
   }, [estimatedAmount]);

   const throttle = (func, ms) => {
      let isThrottled = false,
         savedArgs,
         savedThis;

      function wrapper() {
         if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
         }

         func.apply(this, arguments);

         isThrottled = true;

         setTimeout(function () {
            isThrottled = false;
            if (savedArgs) {
               wrapper.apply(savedThis, savedArgs);
               savedArgs = savedThis = null;
            }
         }, ms);
      }

      return wrapper;
   };

   const userValueFrom = (e) => {
      setInputFromValue(e.target.value);

      throttle(
         ServerAPI.getEstimatedAmount(
            inputFromValue,
            exchangeFrom.ticker,
            exchangeTo.ticker
         ),
         500
      );
   };

   const setFrom = (name, image) => {
      dispatch(
         setExchangeFrom(
            ...currencies.filter(
               (currency) => currency.name === name && currency.image === image
            )
         )
      );
      setSearchFromIsOpened(false);
      setSearchFromStringValue('');
   };

   const setTo = (name, image) => {
      dispatch(
         setExchangeTo(
            ...currencies.filter(
               (currency) => currency.name === name && currency.image === image
            )
         )
      );
      setSearchToIsOpened(false);
      setSearchToStringValue('');
   };

   let currentFromIcon = {
      backgroundImage: 'url(' + exchangeFrom.image + ')',
   };
   let currentToIcon = {
      backgroundImage: 'url(' + exchangeTo.image + ')',
   };
   let exchangeToError = 'hidden';
   exchangeError ? (exchangeToError = 'error') : (exchangeToError = 'hidden');
   return (
      <div className="App">
         <div className="exchangeContainer">
            <div className="exchangeFrom">
               {searchFromIsOpened
                  ? <Search
                     searchCurrencies={setSearchFromStringValue}
                     setSearch={setSearchFromIsOpened}
                     currencies={currencies}
                     exchangeContext={setFrom}
                  />
                  : <div className="controls">
                     <input
                        type="text"
                        className={'inputValue'}
                        onChange={userValueFrom}
                        value={inputFromValue || ''}
                        aria-label="Enter the exchange amount"
                     />
                     <button
                        className="currentFrom"
                        style={currentFromIcon}
                        onClick={(e) => {
                           setSearchFromIsOpened(!searchFromIsOpened);
                        }}
                        aria-label="Select currency to exchange"
                     >
                        {exchangeFrom.ticker.slice(0, 4)}
                     </button>
                  </div>
               }
            </div>

            <button
               className="swapTickers"
               aria-label="Swap tickers, not available now"
               title="Swap tickers, not available now"
               disabled
            ></button>

            <div className="exchangeTo">
               {searchToIsOpened
                  ? <Search
                     searchCurrencies={setSearchToStringValue}
                     setSearch={setSearchToIsOpened}
                     currencies={currencies}
                     exchangeContext={setTo}
                  />
                  : <div className="controls">
                     <input
                        type="text"
                        className={'inputValue'}
                        onChange={userValueFrom}
                        value={inputToValue || ''}
                        aria-label="Enter the exchange amount"
                     />
                     <button
                        className="currentFrom"
                        style={currentToIcon}
                        onClick={(e) => {
                           setSearchToIsOpened(!searchFromIsOpened);
                        }}
                        aria-label="Select currency to exchange"
                     >
                        {exchangeTo.ticker.slice(0, 4)}
                     </button>
                  </div>
               }
            </div>

            <GoExchange
               exchangeTo={exchangeTo.name}
               exchangeError={exchangeToError}
               exchangeErrorValue={exchangeErrorValue}
            />

         </div>
      </div>
   );
}

export default Widget;
