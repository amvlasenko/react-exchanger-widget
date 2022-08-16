import {combineReducers} from 'redux';
import {currenciesReducer} from './currenciesReducer';
import {estimatedAmountReducer} from './estimatedAmountReducer';
import {minimalAmountReducer} from './minimalAmountReducer';
import {setExchange} from './setExchange';

export const rootReducer = combineReducers({
   currencies: currenciesReducer,
   minimalAmount: minimalAmountReducer,
   setExchange: setExchange,
   estimatedAmount: estimatedAmountReducer
});
