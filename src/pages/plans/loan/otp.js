import React, { useEffect, useRef, useState } from 'react'
import ReactPinField from "react-pin-field"
import { useHistory } from 'react-router-dom'

function OTP() {
    var Spinner = require('react-spinkit');
    const [isloadingPayment, setisloadingPayment] = useState(false)



    const [data, setdata] = useState(null)
    const [orderRef, setorderRef] = useState(null)
    const inputRef = useRef()
    const history = useHistory()
    const [charge, setcharge] = useState(false)
    const [otp, setotp] = useState("")

    useEffect(() => {
        getData()
        if(data) {
            validateCharge()
        }
    }, [charge])

    useEffect(() => {
        getOrderRef()
        return () => {
            getOrderRef()
        }
    }, [])

    const getOrderRef = () => {
        const item = localStorage.getItem('orderRef')
        setorderRef(item)
    }

    const getData = () => {
        const item = JSON.parse(localStorage.getItem('transData'))
        console.log(data)
        setdata(item)
    }

    const validateCharge = () => {
        setisloadingPayment(true)
        


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "flw_ref": data?.data.flw_ref,
            "otp": otp
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + "card/collection/validate", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if(result.status) {
                cardCollectionVerify(result.data.id)
            }
        })
        .catch(error => console.log('error', error));
       
    }

    const cardCollectionVerify = (id) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch(process.env.REACT_APP_BASE_URL + `card/collection/verify/${id}/${orderRef}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if(result.status) {
                verifyPlan()
            }
        })
        .catch(error => console.log('error', error));
    }

    const verifyPlan = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_API_KEY}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "orderRef": orderRef
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + "buy-plan/payment/loan", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            setisloadingPayment(false)
            if(result.status) {
                history.push('/payment/success', {transactionType: "Loan"})
            }
        })
        .catch(error => console.log('error', error));
    }

    return (
        <div className="lg:px-40 px-8 font-primary">
            
            <div className="flex flex-col max-w-4xl md:h-56 bg-white rounded-lg shadow-lg overflow-hidden md:flex-row my-10 mx-auto">
                <div className="md:flex items-center justify-center md:w-1/2 md:bg-purple-900">
                    <div className="py-6 px-8 md:py-0">
                        <p className="mt-2 text-gray-300 md:text-gray-300">{data?.data.processor_response}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center pb-6 md:py-0 md:w-1/2 md:border-b-8 border-purple-900">
                    <div>
                        <div className="flex flex-col rounded-lg overflow-hidden sm:flex-row">
                            <input value={otp} onChange={(e) => setotp(e.target.value)} className="py-3 px-4 bg-gray-200 text-gray-800 border-gray-300 border-2 outline-none placeholder-gray-500 focus:bg-gray-100" type="number" name="otp" placeholder="Enter OTP" />
                            <button type="button" className="py-3 px-4 bg-purple-900 text-gray-100 font-semibold uppercase hover:bg-purple-800" onClick={() => setcharge(true)}>
                                {isloadingPayment ? (<Spinner name="circle" className="h-5" color='rgb(243, 244, 246)' fadeIn='none' />) : "Proceed"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default OTP
