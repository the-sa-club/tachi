import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { IBaseState } from './baseState'

interface IPayoutState extends Partial<IBaseState> {
  payoutsProcessing: {
    address: string
    status: string
    to: string
    amount: number
    receipt: string
    to2: string
    amount2: number
    receipt2: string
  }[]
  done: boolean
}

const initialState: IPayoutState = {
  payoutsProcessing: [],
  done: false,
}

export const payoutSlice = createSlice({
  name: 'payouts',
  initialState,
  reducers: {
    setPayoutDone: (state, action: PayloadAction<boolean>) => {
      state.done = action.payload
    },
    setPayoutStatus: (
      state,
      action: PayloadAction<{
        address: string
        status: string
        to: string
        amount: number
        receipt: string
        to2: string
        amount2: number
        receipt2: string
      }>,
    ) => {
      const payoutFound = state.payoutsProcessing.find(
        (payout) => payout.address == action.payload.address,
      )
      if (payoutFound) {
        state.payoutsProcessing = state.payoutsProcessing.map((payout) => {
          if (payout.address == action.payload.address) {
            return { ...action.payload }
          }
          return payout
        })
      } else {
        state.payoutsProcessing = [...state.payoutsProcessing, action.payload]
      }
    },
  },
})

// Actions
export const { setPayoutStatus, setPayoutDone } = payoutSlice.actions

// Selectors
export const selectPayouts = (state: RootState) => state.payouts

// Reducer
export default payoutSlice.reducer
