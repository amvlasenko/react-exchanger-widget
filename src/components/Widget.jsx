import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ServerAPI from '../features/ServerAPI';
import {
  fetchCurrencies,
  fetchMinimalAmount,
  setExchangeTo,
  setExchangeFrom,
  fetchEstimatedAmount,
} from '../redux/actions';
import { Currencies } from './Currencies';
import { Search } from './Search';

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
    dispatch(
      fetchEstimatedAmount(
        inputFromValue,
        exchangeFrom.ticker,
        exchangeTo.ticker
      )
    );
  }, [inputFromValue]);

  useEffect(() => {
    dispatch(fetchMinimalAmount(exchangeFrom.ticker, exchangeTo.ticker));
  }, [dispatch, exchangeFrom, exchangeTo]);

  useEffect(() => {
    setExchangeError(!minimalAmount.error ? false : true);
    setExchangeErrorValue(!minimalAmount.error ? '' : minimalAmount.error);
    setInputFromValue(!minimalAmount.error ? minimalAmount.minAmount : '0');
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
    <div className='App'>
      <div className='exchangeContainer'>
        <div className='exchangeFrom'>
          <div className='controls'>
            {searchFromIsOpened ? (
              <Search
                searchCurrencies={(e) =>
                  setSearchFromStringValue(e.target.value)
                }
              />
            ) : (
              <input
                type='text'
                className={'inputValue'}
                onChange={userValueFrom}
                value={inputFromValue}
                aria-label='Enter the exchange amount'
              />
            )}
            {!searchFromIsOpened ? (
              <button
                className='currentFrom'
                style={currentFromIcon}
                onClick={(e) => {
                  setSearchFromIsOpened(!searchFromIsOpened);
                }}
                aria-label='Select currency to exchange'
              >
                {exchangeFrom.ticker.slice(0, 4)}
              </button>
            ) : null}
            {searchFromIsOpened ? (
              <Currencies
                searchString={searchFromStringValue}
                currencies={currencies}
                setExchange={setFrom}
              />
            ) : null}
          </div>
        </div>
        <button
          className='swapTickers'
          aria-label='Swapping tickers, not available now'
        ></button>
        {/* /* This controls change right controls */}
        <div className='exchangeTo'>
          <div className='controls'>
            {searchToIsOpened ? (
              <Search
                searchCurrencies={(e) => setSearchToStringValue(e.target.value)}
              />
            ) : (
              <input
                type='text'
                className='inputValue'
                onChange={(e) => {
                  setInputToValue(e.target.value);
                }}
                value={inputToValue}
                aria-label='You will get'
              />
            )}
            {!searchToIsOpened ? (
              <button
                className='currentTo'
                style={currentToIcon}
                onClick={(e) => {
                  setSearchToIsOpened(!searchToIsOpened);
                }}
                aria-label='Select currency to exchange'
              >
                {exchangeTo.ticker.slice(0, 4)}
              </button>
            ) : null}

            {searchToIsOpened ? (
              <Currencies
                searchString={searchToStringValue}
                currencies={currencies}
                setExchange={setTo}
              />
            ) : null}
          </div>
        </div>
        <div className='goExchange'>
          <label htmlFor='exchangeAddress'>
            Your {exchangeTo.name ? exchangeTo.name : 'Ethereum'} address
            <input
              type='text'
              className='exchangeAddress'
              id='exchangeAddress'
              aria-label='Enter exchange address'
            />
          </label>
          <button className='exchangeSubmit' aria-label='Make an exchange'>
            Exchange
            <div className={exchangeToError}>
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
      </div>
    </div>
  );
}

export { Widget };
