import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Banner from './shared/banner'
import user from '../../assets/img/vector.svg'
import './plans.css'
import Individual from './individual'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
var Spinner = require('react-spinkit');

function RenewCover() {
    const [individualTab, setindividualTab] = useState(true)
    const [phonePolicy, setphonePolicy] = useState("")
    const [companyRC, setcompanyRC] = useState("")
    const [customerDetail, setcustomerDetail] = useState(null)
    const [showCustomer, setshowCustomer] = useState(false)

    const [isloading, setisloading] = useState(false)
    const [error, seterror] = useState(null)
    const [transDetail, settransDetail] = useState(null)

    //Routing
    const history = useHistory();


    //Notif
    const paymentSuccess = () => toast.success('Renewal Successfull', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "toastify"
        });
    
    const changeTab = (tab) => {
        if(tab === 'individual') {
            setindividualTab(true)
        } else {
            setindividualTab(false)
        }
    }
    const chooseImage = () => {
        document.getElementById('photo').click();  
        
    }

    const RenewIndividual = () => {
        setisloading(true)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_API_KEY}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + `buy-plan/renew?data=${phonePolicy}&type=individual`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            setisloading(false)
            if(result.status == false) {
                // generateLink(result.data)
                setshowCustomer(true)
                settransDetail(result.data)
            }
        })
        .catch(error => console.log('error', error));
            
            
    }

    const RenewSME = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_API_KEY}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + `buy-plan/renew?data=${companyRC}&type=sme`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if(result.status == false) {
                // setdetail(result.data)
            }
        })
        .catch(error => console.log('error', error));
            
            
    }

    const generateLink = (data) => {
        setisloading(true)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_API_KEY}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "orderReference": data.order_ref,
            paymentType: "RENEWAL"
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + "buy-plan/payment", requestOptions)
        .then(response => response.json())
        .then(result => {
            setisloading(false)
            console.log(result)
            if(result.status == true) {
                window.location.assign(result.data.link)
            }
        })
        .catch(error => console.log('error', error));
    }
   

    


    
    return (
        <div>
            <ToastContainer />
            <Banner bannerHeader="Renew Cover"></Banner>

            <div className="lg:px-80 px-8 mt-28  font-primary mb-40">
                {!showCustomer ? (
                    <div className="form text-center lg:px-5 px-0">
                        <div className="tabs">
                            <ul>
                                <li className={individualTab ? "active cursor-pointer" : " cursor-pointer"} onClick={() => changeTab('individual')}>Individual</li>
                                <li className={!individualTab ? "active cursor-pointer" : " cursor-pointer"} onClick={() => changeTab('SME')}>SME</li>
                            </ul>
                        </div>
                        <div className="tab-content">
                            {individualTab ? (
                                <>
                                    <div className="w-full text-left">
                                        <input className="renew-cover-input" type="text" placeholder="Enter Phone number or Policy Number" value={phonePolicy} onChange={(e) => setphonePolicy(e.target.value)} />
                                        <button onClick={RenewIndividual} type='button' className="renew-cover-button">{isloading ? (
                                            <Spinner name="circle" fadeIn='none' color='#fff'/>
                                        ) : (
                                            "Proceed"
                                        )} </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full text-left">
                                        <input className="renew-cover-input" type="text" placeholder="Enter company name or Rc number" value={companyRC} onChange={(e) => setcompanyRC(e.target.value)} />
                                        <button onClick={RenewSME} type="button" className="renew-cover-button">Proceed</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>    

                ) : (
                    <div className="confirm-cover-details">
                        <div>
                            <h1 className="header mb-3">Confirm Details</h1>
                            <div>
                                <p>{transDetail?.entity[0].entity_firstname} {transDetail?.entity[0].entity_lastname}</p>
                            </div>

                            {/* <h1 className="header mt-9 mb-10">Renew Details</h1> */}

                            <div className="mb-10">
                                <label htmlFor="photo"></label>
                                <div className="flex gap-x-2 w-2/6 cursor-pointer items-center">
                                    {/* <img src={imgData} alt="db" width="68px" height="68px"/> */}
                                </div>
                            </div>

                            <table className="table-fixed w-full hidden md:block">
                                <tbody className="w-full table">
                                    <tr className="">
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Amount</span>  <br />
                                         {/* <span className="text-black font-medium text-lg">{transDetail?.order_amount}</span>  */}
                                         <input className='border p-2 text-base font-medium outline-none w-full' type="text" value={transDetail?.order_amount} />
                                        </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Type</span>  <br /> 
                                            {/* <span className="text-black font-medium text-lg">{transDetail?.order_type}</span>  */}
                                            <select className="border p-2 text-base font-medium outline-none w-full" value={transDetail?.order_type}>
                                                <option value={transDetail?.order_type}>{transDetail?.order_type}</option>
                                            </select>
                                        </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Plan Name</span>  <br /> <span className="text-black font-medium text-lg">{transDetail?.plan.plan_name}</span> </td>
                                    </tr>
                                    <tr className="">
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Plan Tenure</span>  <br /> 
                                            {/* <span className="text-black font-medium text-lg">{transDetail?.plan.plan_tenure}</span>  */}
                                            <select className="border p-2 text-base font-medium outline-none w-full" value={transDetail?.plan.plan_tenure}>
                                                <option value={transDetail?.plan.plan_tenure}>{transDetail?.plan.plan_tenure}</option>
                                            </select>
                                        </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Status</span>  <br /> <span className="text-black font-medium text-lg">{transDetail?.order_status}</span> </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Hospital</span>  <br /> 
                                        {/* <span className="text-black font-medium text-lg">{transDetail?.entity.entity_hospital}</span>  */}
                                        <input className='border p-2 text-base font-medium outline-none w-full' type="text" value={transDetail?.entity.entity_hospital || "N/A"} />
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>

                            <table className="table-fixed w-full block md:hidden">
                                <tbody className="w-full table">
                                    <tr className="">
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold lg:text-lg text-base">Amount</span>  <br />
                                         {/* <span className="text-black font-medium text-lg">{transDetail?.order_amount}</span>  */}
                                         <input className='border p-2 text-base font-medium outline-none w-full' type="text" value={transDetail?.order_amount} />
                                        </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold lg:text-lg text-base">Type</span>  <br /> 
                                            {/* <span className="text-black font-medium text-lg">{transDetail?.order_type}</span>  */}
                                            <select className="border p-2 text-base font-medium outline-none w-full" value={transDetail?.order_type}>
                                                <option value={transDetail?.order_type}>{transDetail?.order_type}</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold lg:text-lg text-base">Plan Name</span>  <br /> <span className="text-black font-medium text-lg">{transDetail?.plan.plan_name}</span> </td>
                                    </tr>
                                    <tr className="">
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold lg:text-lg text-base">Plan Tenure</span>  <br /> 
                                            {/* <span className="text-black font-medium text-lg">{transDetail?.plan.plan_tenure}</span>  */}
                                            <select className="border p-2 text-base font-medium outline-none w-full" value={transDetail?.plan.plan_tenure}>
                                                <option value={transDetail?.plan.plan_tenure}>{transDetail?.plan.plan_tenure}</option>
                                            </select>
                                        </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold lg:text-lg text-base">Status</span>  <br /> <span className="text-black font-medium text-lg">{transDetail?.order_status}</span> </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold lg:text-lg text-base">Hospital</span>  <br /> 
                                        {/* <span className="text-black font-medium text-lg">{transDetail?.entity.entity_hospital}</span>  */}
                                        <input className='border p-2 text-base font-medium outline-none w-full' type="text" value={transDetail?.entity.entity_hospital || "N/A"} />
                                        </td>

                                    </tr>
                                    
                                </tbody>
                            </table>

                            <div>
                                <button 
                                    onClick={() => generateLink(transDetail)}
                                    type="button" className="individual-btn mt-14 mb-14 uppercase">{isloading ? (<Spinner name="circle" color='#fff' fadeIn='none' />) : ("Make Payment")}</button>
                            </div>
                            
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RenewCover
