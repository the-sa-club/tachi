import React, { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { selectPayouts } from '../../../reduxStore/features/payoutsSlice'
import authService from '../../../services/authService'
import hdWallet from '../../../services/hdWallet'
import { IBaseProps } from '../../BaseLayout'
import useMyState from '../useMyState'
import CheckIcon from '@heroicons/react/outline/CheckIcon'
import XIcon from '@heroicons/react/outline/XIcon'
import { IPayoutDetails } from '../../../models/IPayoutDetails'

interface IProps extends IBaseProps {
  payoutDetails: IPayoutDetails[]
}
const Main: FC<IProps> = (props) => {
  const [state, dispatch] = useMyState()
  const payouts = useSelector(selectPayouts).payoutsProcessing
  const payoutsProcessingDone = useSelector(selectPayouts).done

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.setItem('tx_signing_msgs', JSON.stringify(payouts))
      localStorage.removeItem('tx_signing_msgs')
    }

    authService.isRegistered().then((isRegistered) => {
      if (!isRegistered) {
        dispatch({ type: 'notRegistered' })
      } else if (authService.isAuthenticated()) {
        dispatch({ type: 'authenticated', payload: props.payoutDetails })
      } else {
        dispatch({ type: 'notAuthenticated' })
      }
    })
  }, [])

  const onApprove = async () => {
    try {
      const receipts = await hdWallet.payoutAccounts(state.payoutDetails)
    } catch (er) {
      dispatch({ type: 'setError', payload: er.toString() })
    }
  }

  let toRender = <></>
  if (state.loading) {
    toRender = <></>
  } else if (!state.loggedIn) {
    return <Redirect to={{ pathname: '/login', state: { from: '/' } }} />
  } else if (state.err) {
    toRender = (
      <div className="flex flex-col justify-center w-full h-full px-4 text-lg text-clubred-dark">
        <div className="w-full px-2 h-3/12">
          <img className="w-auto h-20 mx-auto " src="./icon.png" alt="" />
        </div>
        <div className="w-full px-8 text-center h-3/12">{state.err}</div>
      </div>
    )

    setTimeout(() => {
      localStorage.setItem('sync_msgs', JSON.stringify(''))
      localStorage.removeItem('sync_msgs')
      window.close()
    }, 50000)
  } else if (payouts.length > 0) {
    toRender = (
      <div className="flex flex-col w-full h-full px-2 py-2 text-lg text-clubred-light">
        <div className="flex flex-col items-stretch flex-grow w-full px-2 py-3 overflow-y-scroll">
          <div className="flex w-full h-auto px-2 py-2 mt-2 bg-gray-800 rounded w-12/12 box-material">
            <div className="w-10/12 mr-1 text-2xs">Address</div>
            <div className="w-2/12 mr-1 text-2xs">STATUS</div>
          </div>
          {payouts.map((payout, i: number) => (
            <div
              key={i}
              className="flex w-full h-auto px-2 py-2 mt-2 bg-gray-800 rounded w-12/12 box-material"
            >
              <div className="w-10/12 mr-1 text-gray-400 text-2xs">
                {payout.address}
              </div>
              <div className="flex items-center w-2/12 mr-1 font-bold text-gray-400 text-2xs ">
                {payout.status.toUpperCase() == 'DONE' ? (
                  <CheckIcon className="w-4 h-4 text-green-500 " />
                ) : payout.status.toUpperCase() == 'FAILED' ? (
                  <XIcon className="w-4 h-4 text-clubred-dark " />
                ) : (
                  payout.status.toUpperCase()
                )}
              </div>
            </div>
          ))}
        </div>
        {payoutsProcessingDone ? (
          <div className="flex flex-col w-full text-xs">
            <button
              onClick={() => {
                localStorage.setItem('tx_signing_msgs', JSON.stringify(payouts))
                localStorage.removeItem('tx_signing_msgs')
                window.close()
              }}
              className="flex-grow px-4 py-2 m-1 text-white rounded bg-clubred-dark hover:bg-clubred-light "
            >
              Done
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    )
  } else if (state.payoutDetails.length > 0) {
    const detailsToDisplay: any = []
    state.payoutDetails.forEach((payout, i: number) => {
      detailsToDisplay.push({
        from: payout.from,
        to: payout.to,
        amount: payout.amount,
      })
      detailsToDisplay.push({
        from: payout.from,
        to: payout.to2,
        amount: payout.amount2,
      })
    })
    toRender = (
      <div className="flex flex-col w-full h-full px-2 py-2 text-lg text-clubred-light">
        <div className="flex flex-wrap items-center w-full px-2 py-3 h-2/12">
          <img className="w-auto h-14 " src="./icon.png" alt="" />
          <div className="ml-2">Payout Approval</div>
          <div className="w-full h-px mt-2 bg-gray-700"></div>
        </div>

        <div className="flex flex-col items-stretch flex-grow w-full px-2 py-3 overflow-y-scroll">
          <div className="flex w-full h-auto px-2 py-2 mt-2 bg-gray-800 rounded w-12/12 box-material">
            <div className="w-1/12 mr-1 text-2xs">ID</div>
            <div className="w-5/12 mr-1 text-2xs">From</div>
            <div className="w-5/12 mr-1 text-2xs">To</div>
            <div className="w-1/12 mr-1 text-2xs">Amount</div>
          </div>
          {detailsToDisplay.map((payout: any, i: number) => (
            <div
              key={i}
              className="flex w-full h-auto px-2 py-2 mt-2 bg-gray-800 rounded w-12/12 box-material"
            >
              <div className="w-1/12 mr-1 text-gray-400 text-2xs">{i}</div>
              <div className="w-5/12 mr-1 text-gray-400 text-2xs">
                {payout.from}
              </div>
              <div className="w-5/12 mr-1 text-gray-400 text-2xs">
                {payout.to}
              </div>
              <div className="w-1/12 mr-1 text-gray-400 text-2xs">
                {payout.amount}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col w-full text-xs">
          <button
            onClick={() => {
              localStorage.setItem('tx_signing_msgs', JSON.stringify(''))
              localStorage.removeItem('tx_signing_msgs')
              window.close()
            }}
            className="flex-grow px-4 py-2 m-1 text-white rounded bg-clubred-dark hover:bg-clubred-light "
          >
            Cancel
          </button>
          <button
            onClick={() => onApprove()}
            className="flex-grow px-4 py-2 m-1 text-white rounded bg-clubred-dark hover:bg-clubred-light "
          >
            Approve
          </button>
        </div>
      </div>
    )
  }

  return <>{toRender}</>
}

export default Main
