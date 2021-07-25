import React, { useState, useEffect } from 'react';
import serverAPI from '../features/serverAPI';
import { Currencies } from './Currencies';
import { Search } from './Search';

function Widget() {
    const [currencies, setCurrencies] = useState([]);
    const [exchangeFrom, setExchangeFrom] = useState({
        ticker: 'btc',
        image: 'https://changenow.io/images/sprite/currencies/btc.svg',
    });
    const [exchangeTo, setExchangeTo] = useState({
        ticker: 'eth',
        image: 'https://changenow.io/images/sprite/currencies/eth.svg',
    });
    const [minimalAmount, setMinimalAmount] = useState('');
    const [estimatedAmount, setEstimatedAmount] = useState('');
    const [inputFromValue, setInputFromValue] = useState('');
    const [inputToValue, setInputToValue] = useState('');
    const [searchFromIsOpened, setSearchFromIsOpened] = useState(false);
    const [searchToIsOpened, setSearchToIsOpened] = useState(false);
    const [searchFromStringValue, setSearchFromStringValue] = useState('');
    const [searchToStringValue, setSearchToStringValue] = useState('');
    const [exchangeError, setExchangeError] = useState(false);
    const [exchangeErrorValue, setExchangeErrorValue] = useState('');

    useEffect(() => {
        async function fetchData() {
            let currenciesResponse = await serverAPI.getCurrenies();
            setCurrencies(currenciesResponse);
            let minAmountResponse = await serverAPI.getMinAmount(
                exchangeFrom.ticker,
                exchangeTo.ticker,
                minimalAmount
            );
            setMinimalAmount(minAmountResponse);
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            setExchangeError(!minimalAmount.error ? false : true);
            setExchangeErrorValue(
                !minimalAmount.error ? '' : minimalAmount.error
            );
            setInputFromValue(
                !minimalAmount.error ? minimalAmount.minAmount : '0'
            );
        }
        fetchData();
    }, [minimalAmount]);

    useEffect(() => {
        async function fetchData() {
            let estimatedAmountResponse = await serverAPI.getEstimatedAmount(
                inputFromValue,
                exchangeFrom.ticker,
                exchangeTo.ticker
            );
            setInputToValue(estimatedAmountResponse);
            setEstimatedAmount(estimatedAmountResponse);
        }
        fetchData();
    }, [inputFromValue]);

    useEffect(() => {
        async function fetchData() {
            let minAmountResponse = await serverAPI.getMinAmount(
                exchangeFrom.ticker,
                exchangeTo.ticker,
                minimalAmount
            );
            setMinimalAmount(minAmountResponse);
        }
        fetchData();
    }, [exchangeFrom, exchangeTo]);

    useEffect(() => {
        setExchangeError(estimatedAmount.estimatedAmount ? false : true);
        setExchangeErrorValue(
            estimatedAmount.estimatedAmount ? '' : estimatedAmount.error
        );
        setInputToValue(
            estimatedAmount.estimatedAmount
                ? estimatedAmount.estimatedAmount
                : '-'
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
            serverAPI.getEstimatedAmount(
                inputFromValue,
                exchangeFrom.ticker,
                exchangeTo.ticker
            ),
            500
        );
    };

    const setFrom = (name, image) => {
        setExchangeFrom(
            ...currencies.filter(
                (currency) => currency.name === name && currency.image === image
            )
        );
        setSearchFromIsOpened(false);
        setSearchFromStringValue('');
    };

    const setTo = (name, image) => {
        setExchangeTo(
            ...currencies.filter(
                (currency) => currency.name === name && currency.image === image
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
                    <div className="controls">
                        {searchFromIsOpened ? (
                            <Search
                                searchCurrencies={(e) =>
                                    setSearchFromStringValue(e.target.value)
                                }
                            />
                        ) : (
                            <input
                                type="text"
                                className={'inputValue'}
                                onChange={userValueFrom}
                                value={inputFromValue}
                                aria-label="Enter the exchange amount"
                            />
                        )}
                        {!searchFromIsOpened ? (
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
                        ) : null}
                        {searchFromIsOpened ? (
                            <Currencies
                                searchString={searchFromStringValue}
                                currencies={currencies}
                                setCurrent={setFrom}
                                getMinAmount={serverAPI.getMinAmount}
                            />
                        ) : null}
                    </div>
                </div>
                <button
                    className="swapTickers"
                    aria-label="Swapping tickers, not available now"
                ></button>
                {/* /* This controls change right controls */}
                <div className="exchangeTo">
                    <div className="controls">
                        {searchToIsOpened ? (
                            <Search
                                searchCurrencies={(e) =>
                                    setSearchToStringValue(e.target.value)
                                }
                            />
                        ) : (
                            <input
                                type="text"
                                className="inputValue"
                                onChange={(e) => {
                                    setInputToValue(e.target.value);
                                }}
                                value={inputToValue}
                                aria-label="You will get"
                            />
                        )}
                        {!searchToIsOpened ? (
                            <button
                                className="currentTo"
                                style={currentToIcon}
                                onClick={(e) => {
                                    setSearchToIsOpened(!searchToIsOpened);
                                }}
                                aria-label="Select currency to exchange"
                            >
                                {exchangeTo.ticker.slice(0, 4)}
                            </button>
                        ) : null}

                        {searchToIsOpened ? (
                            <Currencies
                                searchString={searchToStringValue}
                                currencies={currencies}
                                setCurrent={setTo}
                                getMinAmount={serverAPI.getMinAmount}
                            />
                        ) : null}
                    </div>
                </div>
                <div className="goExchange">
                    <label htmlFor="exchangeAddress">
                        Your {exchangeTo.name ? exchangeTo.name : 'Ethereum'}{' '}
                        address
                        <input
                            type="text"
                            className="exchangeAddress"
                            id="exchangeAddress"
                            aria-label="Enter exchange address"
                        />
                    </label>
                    <button
                        className="exchangeSubmit"
                        aria-label="Make an exchange"
                    >
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
