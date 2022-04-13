// import { useHistory } from 'react-router-dom'
import React, { useEffect } from 'react'
function Success() {
    const txnRef = new URLSearchParams(window.location.search).get('msg')
    

    useEffect(() => clearSession(), [])

    const clearSession = () => {
        setTimeout(() => {
            window.localStorage.clear()  
        }, 1000);
    }
    
    // console.log(txnType)
    return (
        <div>
            <div className="h-screen font-primary">
                <div className="bg-white p-6  md:mx-auto">
                    <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                        <path fill="currentColor"
                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                        </path>
                    </svg>
                    <div className="text-center">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
                        {txnRef ? (
                            <>
                                <p className="text-gray-600 my-2">Your request to get a loan to purchase health insurance has been received.</p>
                                <p> We will get back to you with a feedback within 24hours.  </p>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-600 my-2">Your health insurance purchase from  Nucleus is successful.</p>
                                <p> Your request is now with our partner HMO for fulfillment.  </p>
                            </>
                        )}
                        <div className="py-10 text-center">
                            <a href="/" className="individual-btn mt-14 mb-14 uppercase">
                                HOME PAGE
                        </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Success
