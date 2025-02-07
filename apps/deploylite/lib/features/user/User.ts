import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
    user: {
        name: string,
        username:string,
        email: string,
        img: string,
        authtoken?: string,
        githubid?: string,
        githubtoken?: string
        isverified: boolean,
        is0auth: boolean,
        bio: string,
        phone: string,
        twofactor?:boolean,
        connectgithub?:boolean
    };
}

const initialState: UserState = {
    user: {
        name:"",
        username:"",
        email:"",
        img:"",
        authtoken:"",
        githubid:"",
        githubtoken:"",
        isverified:false,
        is0auth:false,
        bio:"",
        phone:"",
        twofactor:false,
        connectgithub:false
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        add: (state, action) => {
            // Magic
            // Immer will handle the mutation
            state.user=action.payload
        },
    },
});

// Action creators are generated for each case reducer function
export const { add } = userSlice.actions;

export default userSlice.reducer;