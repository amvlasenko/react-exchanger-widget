import { combineReducers } from 'redux';
import { currenciesReducer } from './currenciesReducer';
import {minimalAmountReducer} from './minimalAmountReducer'

export const rootReducer = combineReducers({
    currencies: currenciesReducer,
    minimalAmount: minimalAmountReducer,
});
