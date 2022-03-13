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
        const val = inputRef.current.inputs.map((input) => {
            return input.value
        })
        console.log(val.join(""))


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "flw_ref": data?.data.flw_ref,
            "otp": val.join("")
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
                history.push('/payment/success')
            }
        })
        .catch(error => console.log('error', error));
    }

    return (
        <div className="lg:px-40 px-8 font-primary">
            <div className="fixed inset-0 w-full h-full flex bg-blue-100 items-center justify-center">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="font-thin px-2 pb-4 text-lg">{data?.data.processor_response}</div>
                    <div className="flex w-1/2 m-auto justify-center">
                        {/* <div>
                            <input className="h-16 w-12 border mx-2 rounded-lg flex items-center text-center font-thin text-3xl outline-none" maxLength="1" max="9" min="0" inputMode="decimal" onKeyUp={tabFunction}></input>
                        </div> */}
                        <ReactPinField
                        ref={inputRef}
                        validate="0123456789"
                        class="pin-field"
                        autocapitalize="off"
                        autocorrect="off"
                        autocomplete="off"
                        inputmode="text"
                        onComplete={() => setcharge(true)}
                          >
                          </ReactPinField>
                    </div>
                    <div className="mt-5 text-center flex justify-center">
                        {isloadingPayment && (<Spinner name="circle" className="h-5" color='#777' fadeIn='none' />)}
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default OTP
