import { FETCH_ESTIMATED_AMOUNT } from "./types";

const initialState = {
    estimatedAmount: '',
};

export const estimatedAmountReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ESTIMATED_AMOUNT:
            return { ...state, estimatedAmount: action.payload };
        default:
            return state;
    }
};