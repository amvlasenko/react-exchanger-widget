import { SET_EXCHANGE_FROM, SET_EXCHANGE_TO } from "./types";

const initialState = {
    exchangeFrom: {
        ticker: 'btc',
        image: 'https://changenow.io/images/sprite/currencies/btc.svg',
    },
    exchangeTo: {
        ticker: 'eth',
        image: 'https://changenow.io/images/sprite/currencies/eth.svg',
    },
};

export const setExchange = (state = initialState, action) => {
    switch (action.type) {
        case SET_EXCHANGE_FROM:
            return { ...state, exchangeFrom: action.payload }
            case SET_EXCHANGE_TO:
            return { ...state, exchangeTo: action.payload }
        default:
            return state;
    }
};