import {FETCH_CURRENCIES} from './types';

const initialState = {
   currencies: [],
};

export const currenciesReducer = (state = initialState, action) => {
   switch (action.type) {
      case FETCH_CURRENCIES:
         return {...state, currencies: action.payload};
      default:
         return state;
   }
};
