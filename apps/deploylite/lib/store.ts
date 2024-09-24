import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './features/user/User'
import { walletSlice } from './features/wallet/Wallet'
import { AwsSlice } from './features/aws/aws'
export const makeStore = () => {
  return configureStore({
    reducer: {
       user:userSlice.reducer,
       wallet:walletSlice.reducer,
       aws:AwsSlice.reducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']