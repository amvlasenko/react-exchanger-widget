import ServerAPI from '../features/ServerAPI';
import { FETCH_CURRENCIES } from './types';

export function fetchCurrencies() {
    return async (dispatch) => {
        let currenciesResponse = await ServerAPI.getCurrenies();
        dispatch({ type: FETCH_CURRENCIES, payload: currenciesResponse });
    };
}
