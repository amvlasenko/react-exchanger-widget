import { combineReducers } from 'redux';
import { currenciesReducer } from './currenciesReducer';
export const rootReducer = combineReducers({
    currencies: currenciesReducer,
});
