import ServerAPI from '../features/ServerAPI';
import { FETCH_CURRENCIES, FETCH_MINIMAL_AMOUNT } from './types';

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


