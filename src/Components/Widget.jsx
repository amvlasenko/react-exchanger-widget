import React from 'react';
import { Currencies } from './Currencies';
import { Search } from './Search';

const KEY = 'c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd';

class Widget extends React.Component {
    state = {
        currencies: [],
        exchangeFrom: [
            {
                ticker: 'btc',
                image: 'https://changenow.io/images/sprite/currencies/btc.svg',
            },
        ],
        exchangeTo: [
            {
                ticker: 'eth',
                image: 'https://changenow.io/images/sprite/currencies/eth.svg',
            },
        ],
        minimalAmount: '',
        estimatedAmount: '',
        inputFromValue: '',
        inputToValue: '',
        searchFromIsOpened: false,
        searchToIsOpened: false,
        searchFromStringValue: '',
        searchToStringValue: '',
        exchangeError: false,
        exchangeErrorValue: '',
    };

    componentDidMount() {
        fetch(
            'https://api.changenow.io/v1/currencies?active=true&fixedRate=true'
        )
            .then((response) => response.json())
            .then((data) => this.setState({ currencies: data }))
            .catch((error) => console.log('error', error));
        fetch(`https://api.changenow.io/v1/min-amount/btc_eth?api_key=${KEY}`)
            .then((response) => response.json())
            .then((data) => this.setState({ minimalAmount: data.minAmount }))
            .then(() =>
                this.setState({ inputFromValue: this.state.minimalAmount })
            )
            .then(() =>
                fetch(
                    `https://api.changenow.io/v1/exchange-amount/${this.state.inputFromValue}/btc_eth?api_key=${KEY}`
                )
                    .then((response) => response.json())
                    .then((data) => this.setState({ estimatedAmount: data }))
                    .then(() =>
                        this.setState({
                            inputToValue:
                                this.state.estimatedAmount.estimatedAmount,
                        })
                    )
            )
            .catch((error) => console.log('error', error));
    }

    getMinAmount = () => {
        const [exchangeFrom] = this.state.exchangeFrom;
        const [exchangeTo] = this.state.exchangeTo;

        fetch(
            `https://api.changenow.io/v1/min-amount/${exchangeFrom.ticker}_${exchangeTo.ticker}?api_key=${KEY}`
        )
            .then((response) => response.json())
            .then((data) => this.setState({ minimalAmount: data }))
            .then(() =>
                !this.state.minimalAmount.error
                    ? this.setState({
                          exchangeError: false,
                          exchangeErrorValue: '',
                          inputFromValue: this.state.minimalAmount.minAmount,
                      })
                    : this.setState({
                          inputToValue: '-',
                          exchangeError: true,
                          exchangeErrorValue: this.state.minimalAmount.error,
                          inputFromValue: '0',
                      })
            )
            .then(() =>
                fetch(
                    `https://api.changenow.io/v1/exchange-amount/${this.state.inputFromValue}/${exchangeFrom.ticker}_${exchangeTo.ticker}?api_key=${KEY}`
                )
                    .then((response) => response.json())
                    .then((data) => this.setState({ estimatedAmount: data }))
                    .then(() =>
                        this.setState({
                            inputToValue:
                                this.state.estimatedAmount.estimatedAmount,
                        })
                    )
            )
            .catch((error) => console.log('error', error));
    };

    getEstimatedAmount = () => {
        const [exchangeFrom] = this.state.exchangeFrom;
        const [exchangeTo] = this.state.exchangeTo;
        fetch(
            `https://api.changenow.io/v1/exchange-amount/${this.state.inputFromValue}/${exchangeFrom.ticker}_${exchangeTo.ticker}?api_key=${KEY}`
        )
            .then((response) => response.json())
            .then((data) => this.setState({ estimatedAmount: data }))
            .then(() =>
                this.state.estimatedAmount.estimatedAmount
                    ? this.setState({
                          inputToValue:
                              this.state.estimatedAmount.estimatedAmount,
                          exchangeError: false,
                          exchangeErrorValue: '',
                      })
                    : this.setState({
                          inputToValue: '-',
                          exchangeError: true,
                          exchangeErrorValue: this.state.estimatedAmount.error,
                      })
            )
            .catch((error) => console.log('error', error));
    };

    userValueExchange = (e) => {
        this.setState(
            () => {
                return { inputFromValue: e.target.value };
            },
            () => {
                this.getEstimatedAmount();
            }
        );
    };

    setFrom = (name, image) => {
        this.setState(
            () => {
                return {
                    exchangeFrom: this.state.currencies.filter(
                        (currency) =>
                            currency.name === name && currency.image === image
                    ),
                    searchFromIsOpened: false,
                    searchFromStringValue: '',
                };
            },
            () => this.getMinAmount()
        );
    };

    setTo = (name, image) => {
        this.setState(
            () => {
                return {
                    exchangeTo: this.state.currencies.filter(
                        (currency) =>
                            currency.name === name && currency.image === image
                    ),
                    searchToIsOpened: false,
                    searchToStringValue: '',
                };
            },
            () => this.getMinAmount()
        );
    };

    render() {
        const [exchangeFrom] = this.state.exchangeFrom;
        const [exchangeTo] = this.state.exchangeTo;
        const currentFromIcon = {
            backgroundImage: 'url(' + exchangeFrom.image + ')',
        };
        const currentToIcon = {
            backgroundImage: 'url(' + exchangeTo.image + ')',
        };
        let exchangeToError = 'hidden';
        this.state.exchangeError
            ? (exchangeToError = 'error')
            : (exchangeToError = 'hidden');
        return (
            <div className='App'>
                <div className='exchangeContainer'>
                    <div className='exchangeFrom'>
                        <div className='controls'>
                            {this.state.searchFromIsOpened ? (
                                <Search
                                    searchCurrencies={(e) =>
                                        this.setState({
                                            searchFromStringValue: e,
                                        })
                                    }
                                />
                            ) : (
                                <input
                                    type='text'
                                    className={'inputValue'}
                                    onChange={this.userValueExchange}
                                    value={this.state.inputFromValue}
                                    aria-label='Enter the exchange amount'
                                />
                            )}
                            {!this.state.searchFromIsOpened ? (
                                <button
                                    className='currentFrom'
                                    style={currentFromIcon}
                                    onClick={(e) => {
                                        this.setState({
                                            searchFromIsOpened:
                                                !this.state.searchFromIsOpened,
                                        });
                                    }}
                                    aria-label='Select currency to exchange'
                                >
                                    {exchangeFrom.ticker.slice(0, 4)}
                                </button>
                            ) : null}
                            {this.state.searchFromIsOpened ? (
                                <Currencies
                                    searchString={
                                        this.state.searchFromStringValue
                                    }
                                    currencies={this.state.currencies}
                                    setCurrent={this.setFrom}
                                    getMinAmount={this.getMinAmount}
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
                            {this.state.searchToIsOpened ? (
                                <Search
                                    searchCurrencies={(e) =>
                                        this.setState({
                                            searchToStringValue: e,
                                        })
                                    }
                                />
                            ) : (
                                <input
                                    type='text'
                                    className='inputValue'
                                    onChange={(e) =>
                                        this.setState({
                                            inputToValue: e.target.value,
                                        })
                                    }
                                    value={this.state.inputToValue}
                                    aria-label='You will get'
                                />
                            )}
                            {!this.state.searchToIsOpened ? (
                                <button
                                    className='currentTo'
                                    style={currentToIcon}
                                    onClick={(e) => {
                                        this.setState({
                                            searchToIsOpened:
                                                !this.state.searchToIsOpened,
                                        });
                                    }}
                                    aria-label='Select currency to exchange'
                                >
                                    {exchangeTo.ticker.slice(0, 4)}
                                </button>
                            ) : null}

                            {this.state.searchToIsOpened ? (
                                <Currencies
                                    searchString={
                                        this.state.searchToStringValue
                                    }
                                    currencies={this.state.currencies}
                                    setCurrent={this.setTo}
                                    getMinAmount={this.getMinAmount}
                                />
                            ) : null}
                        </div>
                    </div>
                    <div className='goExchange'>
                        <label htmlFor='exchangeAddress'>
                            Your{' '}
                            {exchangeTo.name ? exchangeTo.name : 'Ethereum'}{' '}
                            address
                            <input
                                type='text'
                                className='exchangeAddress'
                                id='exchangeAddress'
                                aria-label='Enter exchange address'
                            />
                        </label>
                        <button
                            className='exchangeSubmit'
                            aria-label='Make an exchange'
                        >
                            Exchange
                            <div className={exchangeToError}>
                                <span>
                                    {this.state.exchangeErrorValue ===
                                    'deposit_too_small'
                                        ? 'Deposit too small'
                                        : this.state.exchangeErrorValue ===
                                          'pair_is_inactive'
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
}

export { Widget };
