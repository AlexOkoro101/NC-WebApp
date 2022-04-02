import { useHistory } from 'react-router-dom'
import React, { useEffect } from 'react'

function Failure() {
    useEffect(() => clearSession(), [])

    const clearSession = () => {
        setTimeout(() => {
            window.localStorage.clear()  
        }, 1000);
    }


    return (
        <div>
            <div className="h-screen">
                <div className="bg-white p-6  md:mx-auto">
                    <div className="bg-red-300 w-20 m-auto h-20 rounded-full p-1">
                        <svg class="text-red-600 w-16 h-16 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" fill="currentColor"></path></svg>
                    </div>
                    <div className="text-center">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Failed!</h3>
                        <p className="text-gray-600 my-2">Try again or contact support service.</p>
                        <p> Thank you!</p>
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

export default Failure
