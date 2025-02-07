import { createSlice } from '@reduxjs/toolkit';

export interface walletState {
    wallet: {
        userid:string,
        balance:number,
        transactions:[],
    };
}

const initialState: walletState = {
    wallet: {
        userid:"",
        balance:0,
        transactions:[],
    },
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        add: (state, action) => {
            // Magic
            // Immer will handle the mutation
            state.wallet=action.payload
        },
    },
});

// Action creators are generated for each case reducer function
export const { add } = walletSlice.actions;

export default walletSlice.reducer;