import { FETCH_MINIMAL_AMOUNT } from "./types";

const initialState = {
    minimalAmount: 0,
};

export const minimalAmountReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MINIMAL_AMOUNT:
            return { ...state, minimalAmount: action.payload };
        default:
            return state;
    }
};