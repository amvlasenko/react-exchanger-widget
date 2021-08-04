import ServerAPI from '../features/ServerAPI';
import { FETCH_CURRENCIES, FETCH_ESTIMATED_AMOUNT, FETCH_MINIMAL_AMOUNT, SET_EXCHANGE_FROM, SET_EXCHANGE_TO } from './types';

export function fetchCurrencies() {
    return async (dispatch) => {
        let currenciesResponse = await ServerAPI.getCurrenies();
        dispatch({ type: FETCH_CURRENCIES, payload: currenciesResponse });
    };
}

export function fetchMinimalAmount(exchangeFrom, exchangeTo) {
    return async (dispatch) => {
        let minimalAmountResponse = await ServerAPI.getMinAmount(exchangeFrom, exchangeTo);
        dispatch({ type: FETCH_MINIMAL_AMOUNT, payload: minimalAmountResponse });
    };
}

export function setExchangeFrom(currency) {
    return (dispatch) => {
        dispatch({ type: SET_EXCHANGE_FROM, payload: currency });
    }
}

export function setExchangeTo(currency) {
    return (dispatch) => {
        dispatch({ type: SET_EXCHANGE_TO, payload: currency });
    }
}

export function fetchEstimatedAmount(inputFromValue, exchangeFrom, exchangeTo) {
    return async (dispatch) => {
        let estimatedAmountResponse = await ServerAPI.getEstimatedAmount(inputFromValue, exchangeFrom, exchangeTo);
        dispatch({ type: FETCH_ESTIMATED_AMOUNT, payload: estimatedAmountResponse });
    };
}

