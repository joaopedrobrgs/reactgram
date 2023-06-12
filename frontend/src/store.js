import {configureStore} from '@reduxjs/toolkit';

//Reducers:
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer
    }
})