import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Banner from '../shared/banner'
import user from '../../../assets/img/vector.svg'

import '../plans.css'
import { enviroment } from '../../../components/shared/enviroment';
var Spinner = require('react-spinkit');

function SMELoan() {
      const { register, control, handleSubmit, reset, watch } = useForm();
      const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
      } = useFieldArray({
        control,
        name: "enrollees"
      });


    //Hooks
    const [confrimDetail, setconfrimDetail] = useState(false)
    const [planDetails, setplanDetails] = useState(null)
    const [initialPageName, setinitialPageName] = useState("SME Loan")

    const [isloading, setisloading] = useState(false)
    const [isloadingPayment, setisloadingPayment] = useState(false)
    const [error, seterror] = useState(null)

    const [enrolleeArray, setenrolleeArray] = useState([])

    //Form
    const [loanDuration, setloanDuration] = useState(1)
    const [companyName, setcompanyName] = useState("")
    const [companyAddress, setcompanyAddress] = useState("")
    const [companyEmail, setcompanyEmail] = useState("")
    const [companyPhone, setcompanyPhone] = useState("")
    const [companyIndustry, setcompanyIndustry] = useState("")
    const [companyCAC, setcompanyCAC] = useState("")

    const [terms, setterms] = useState(true)




    const [enrolleeDob, setenrolleeDob] = useState(new Date())
    const [enrolleeExistingCondition, setenrolleeExistingCondition] = useState("false")
    const [dependantImgArray, setdependantImgArray] = useState([])

    useEffect(() => {
        getPlanDetails()
        return () => {
            getPlanDetails()
        }
    }, [])
    //End of Hooks


    const dependantChooseImage = (index, e) => {
        document.getElementById(`dependantphoto-${index + 1}`).click();  
        // console.log(e, index)
    }

    function dependantEncodeImageFileAsURL(index) {
        // console.log(watch(`dependant`))
        var filesSelected = document.getElementById(`dependantphoto-${index + 1}`).files;
        if (filesSelected.length > 0) {
          var fileToLoad = filesSelected[0];
    
          var fileReader = new FileReader();
    
          fileReader.onload = function(fileLoadedEvent) {
            // setimgData(fileLoadedEvent.target.result); // <--- data: base64
            setdependantImgArray([...dependantImgArray, fileLoadedEvent.target.result])
            // newArr = [...dependantImgArray]
            // newArr[index] = fileLoadedEvent.target.result
            // console.log(imgData)
    
            // var newImage = document.createElement('img');
            // newImage.src = srcData;
    
            // document.getElementById("imgTest").innerHTML = newImage.outerHTML;
            // alert("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
            // console.log("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
          }
          fileReader.readAsDataURL(fileToLoad);
        }
    }

    const getPlanDetails = () => {
        setisloading(true)
        seterror(false)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${enviroment.API_KEY}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch(enviroment.BASE_URL + "plans/24", requestOptions)
        .then(response => response.json())
        .then(result => {
            setisloading(false)
            console.log(result)
            setplanDetails(result.data)
        })
        .catch(error => {
            console.log('error', error)
            seterror(error)
        });
    }


    const submitForm = (data) => {
        // e.preventDefault()
        if(fields.length && !dependantImgArray.length ) {
            toast.error("Enrollee Image is missing")
            return
        }
        if(fields.length !== dependantImgArray.length) {
            toast.error("Enrollee Image is missing")
            return
        }
        console.log(data.enrollees)
        console.log(control)
        setenrolleeArray(data?.enrollees.map(person => ({ 
            firstname: person.enrolleeFirstName,
            lastname: person.enrolleeLastName,
            email: person.enrolleeEmail,
            phone: person.enrolleePhone,
            gender: person.enrolleeGender,
            dob: person.enrolleeDob.toLocaleDateString(),
            address: person.enrolleeAddress,
            hospital: person.enrolleeHospital,
            existingConditions: person.enrolleeExistingCondition,
            condition: {
                healthCondition: person.enrolleeHealthCondition,
                healthConditionDuration: person.enrolleeConditionDuration,
                healthConditionMedication: person.enrolleeConditionMedication
            }

        })))
        // setdependentArray(data.dependants.map())

        setinitialPageName("Confirm Details")
        setconfrimDetail(true)
    

    }

    const buyPlan = () => {
        setisloadingPayment(true)
        seterror(null)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${enviroment.API_KEY}`);

        const obj = {
            plan: 24,
            paymentType: "LOAN",
            loanDuration: loanDuration,
            agreement: true,
            companyDetails: {
                "companyName": companyName,
                "companyAddress": companyAddress,
                "companyEmail": companyEmail,
                "companyPhone": companyPhone,
                "companyIndustry": companyIndustry,
                "companyCacNo": companyCAC,
            },
            enrollees: enrolleeArray

        }

        if(!enrolleeArray.length) {
            delete obj.enrollees
        }

        // if(enrolleeArray.existingConditions == 'false') {
        //     delete obj.dependants
        // }

        console.log(obj)

    

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(obj),
        redirect: 'follow'
        };

        fetch(enviroment.BASE_URL + "buy-corporate-plan", requestOptions)
        .then(response => response.json())
        .then(result => {
            setisloadingPayment(false)
            console.log(result)
            if(result.status) {
                generateLink(result.data)
            }

        })
        .catch(error => console.log('error', error));

    }

    const generateLink = (data) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${enviroment.API_KEY}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "orderReference": data.orderRef
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(enviroment.BASE_URL + "buy-plan/payment", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if(result.status) {
                window.location.assign(result.data.link)
            }
        })
        .catch(error => console.log('error', error));
    }

    const goBack = () => {
        setinitialPageName("SME")
        setconfrimDetail(false)
    }


    return (
        <div>
            <ToastContainer />
            <Banner bannerHeader={initialPageName}></Banner>

            {isloading ? (
                <div className='px-40 h-screen text-center'>
                    <Spinner className='loader' name='circle' fadeIn='none' color='#8e2b8d' />

                </div>
            ) : (
            <div className="lg:px-64 px-8 mt-28  font-primary">
                <div className="form">
                {!confrimDetail ? (
                    <form onSubmit={handleSubmit(submitForm)}>

                        <h1 className="header mb-3">Plan Details</h1>
                        <div>
                            <div className="flex input-primary w-full px-6 outline-none focus:outline-none items-center">
                                {planDetails?.plan.planName}
                            </div>
                        </div>


                        <div className="mt-5 flex flex-col lg:flex-row gap-8 overflow-hidden">
                            <div className="flex flex-row gap-2">
                                <div className="plan-price-box flex flex-col justify-center">
                                    <p className="text-sm text-white font-medium">Price</p>
                                    <p className="text-lg font-medium text-white">N{planDetails?.plan.planAmount.amount}</p>
                                </div>
                                
                                <div className="plan-duration-box flex flex-col justify-center">
                                    <p className="text-sm text-white font-medium">Plan Duration</p>
                                    <p className="text-lg font-medium text-white">{planDetails?.plan.planTenure}</p>
                                </div>
                            </div>
                            <div className="md:max-w-none bg-white px-8 md:px-5 py-8 md:py-0 mb-3 mx-0 md:-mx-3 md:mb-0 md:relative md:flex md:flex-col lg:border-l lg:h-32 lg:border-t-0 border-t">
                                <div className="w-full flex-grow">
                                    <h2 className="font-bold uppercase mb-4">Plan Benefits</h2>
                                    {/* <h3 className="text-center font-bold text-4xl md:text-5xl mb-4">N19,900<span className="text-lg">/yr</span></h3> */}
                                    
                                    <ul className="text-xs mb-8 plan-detail flex flex-wrap gap-x-4">
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.general_consulation ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.general_consulation ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>General Consultation</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.glasses ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.glasses ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Glasses Specialist</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.specialist_consultation ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.specialist_consultation ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Consultation</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.paedetrics ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.paedetrics ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Paediatrics</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.mental_care ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.mental_care ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Mental Care</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.admission ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.admission ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Admission</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.fertility_care ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.fertility_care ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Fertility Care</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.antenatal_care ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.antenatal_care ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Antenatal Care</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.optical_care ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.optical_care ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Optical Care</span> </li>
                                        <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.dental_care ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.dental_care ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Dental Care</span> </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        <h1 className="header mt-9 mb-10">Corporate Details</h1>

                        <div className="mb-10">
                            <div className="flex flex-col flex-1">
                                <label htmlFor="first-name">Loan Duration</label>
                                <select value={loanDuration} onChange={(e) => setloanDuration(e.target.value)} className=" px-6 focus:outline-none lg:w-1/3 w-full">
                                    <option value={1}>1 Months</option>
                                    <option value={2}>2 Months</option>
                                    <option value={3}>3 Months</option>
                                </select>
                            </div>  
                        </div>

                        <div className="flex flex-col gap-y-6 mb-10">
                            <div className="flex w-full flex-wrap justify-between lg:gap-x-3 gap-y-3 lg:gap-y-0">
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input value={companyName} onChange={(e) => setcompanyName(e.target.value)} className="input-primary px-6 focus:outline-none" type="text" name="company-name" id="company-name" required />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="rc-number">RC Number</label>
                                    <input value={companyCAC} onChange={(e) => setcompanyCAC(e.target.value)} className="input-primary px-6 focus:outline-none" type="text" name="rc-number" id="rc-number" required />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="company-email">Company Email</label>
                                    <input value={companyEmail} onChange={(e) => setcompanyEmail(e.target.value)} className="input-primary px-6 focus:outline-none" type="email" name="company-email" id="company-email" required />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between lg:gap-x-3 gap-y-3 lg:gap-y-0">
                                <div className="flex flex-col lg:w-4/12 ">
                                    <label htmlFor="company-phone">Company Phone No.</label>
                                    <input value={companyPhone} onChange={(e) => setcompanyPhone(e.target.value)} className="input-primary px-6 focus:outline-none" type="number" name="company-phone" id="company-phone" required />
                                </div>
                                <div className="flex flex-col flex-auto">
                                    <label htmlFor="industry">Industry</label>
                                    <input value={companyIndustry} onChange={(e) => setcompanyIndustry(e.target.value)} className="input-primary px-6 focus:outline-none" type="text" name="industry" id="industry" required />
                                </div>
                                
                            </div>

                            <div className="flex  justify-between gap-x-3">
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="company-address">Company Address</label>
                                    <input value={companyAddress} onChange={(e) => setcompanyAddress(e.target.value)} className="input-primary px-6 focus:outline-none" type="text" name="company-address" id="company-address" required />
                                </div>
                               
                            </div>

                            <hr />


                            {fields.map(({id}, index) => {
                                return (
                                    <div className="enrollees" key={index}>

                                        <h1 className="header mt-9 mb-10">Enrollee {`- ${index + 1}`}</h1>


                                        <div className="flex flex-col gap-y-6 mb-10">
                                            <div>
                                                <label htmlFor="photo"></label>
                                                <input {...register(`enrollees.${index}.enrolleePhoto`)} className="input-primary px-6 hidden" type="file" onChange={() => dependantEncodeImageFileAsURL(index)} name={`dependantphoto-${index + 1}`} id={`dependantphoto-${index + 1}`} />
                                                <div className="flex gap-x-2 lg:w-2/6 w-full cursor-pointer items-center" onClick={(e) => {dependantChooseImage(index, e)}}>
                                                    <img src={(dependantImgArray.length && dependantImgArray[index]) ? dependantImgArray[index] : user} alt="db" width="68px" height="68px"/>
                                                    <p className="text-sm font-medium">Tap to upload image</p>
                                                </div>
                                            </div>

                                            <div className="flex w-full flex-wrap justify-between lg:gap-x-3 gap-y-3 lg:gap-y-0">
                                                <div className="flex flex-col flex-1">
                                                    <label>First Name</label>
                                                    <input {...register(`enrollees.${index}.enrolleeFirstName`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Last Name</label>
                                                    <input {...register(`enrollees.${index}.enrolleeLastName`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Email</label>
                                                    <input {...register(`enrollees.${index}.enrolleeEmail`, {required: true})} className="input-primary px-6 focus:outline-none" type="email" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row justify-between lg:gap-x-3 gap-y-3 lg:gap-y-0">
                                                <div className="flex flex-col lg:w-4/12">
                                                    <label>Company Phone No.</label>
                                                    <input {...register(`enrollees.${index}.enrolleePhone`, {required: true})} className="input-primary px-6 focus:outline-none" type="tel" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>D.O.B</label>
                                                    {/* <DatePicker {...register(`enrollees.${index}.enrolleeDob`, {value: enrolleeDob, onChange: (date) => setenrolleeDob(date)})} selected={enrolleeDob} onChange={(date) => setenrolleeDob(date)} className="entity-dob" showYearDropdown scrollableYearDropdown yearDropdownItemNumber={40} /> */}
                                                    <Controller
                                                        render={({ field }) => <DatePicker onChange={(date) => field.onChange(date)}
                                                        selected={field.value} className="entity-dob" 
                                                        showYearDropdown scrollableYearDropdown yearDropdownItemNumber={40} />}
                                                        name={`enrollees.${index}.enrolleeDob`}
                                                        control={control}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex  justify-between gap-x-3">
                                                
                                                <div className="flex flex-col flex-1">
                                                    <label>Address</label>
                                                    <input {...register(`enrollees.${index}.enrolleeAddress`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" />
                                                </div>
                                            </div>

                                            <div className="flex justify-between gap-x-3">
                                                <div className="flex flex-col w-4/12">
                                                    <label>Gender</label>
                                                    <select {...register(`enrollees.${index}.enrolleeGender`)} className="px-6 focus:outline-none" required>
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Hospital Detail</label>
                                                    <input {...register(`enrollees.${index}.enrolleeHospital`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" />
                                                </div>
                                            </div>

                                            <h1 className="header">Enrollee {`${index + 1}`} Condition </h1>

                                            <div className="flex flex-col lg:flex-row lg:gap-y-0 gap-y-3 justify-between lg:gap-x-3">
                                                <div className="flex flex-col  lg:w-4/12">
                                                    <label>Existing Condition</label>
                                                    <select 
                                                    className="input-primary px-6 focus:outline-none" 
                                                    {...register(`enrollees.${index}.enrolleeExistingCondition`, {
                                                        value: enrolleeExistingCondition,
                                                        onChange: (e) => setenrolleeExistingCondition(e.target.value)
                                                    })}>
                                                        <option value="true">True</option>
                                                        <option value="false">False</option>
                                                    </select>
                                                </div>
                                                {enrolleeExistingCondition == "true" && (
                                                    <div className="flex flex-col flex-1">
                                                        <label htmlFor="health-condition">Health Condition</label>
                                                        <input className="input-primary px-6 focus:outline-none" {...register(`enrollees.${index}.enrolleeHealthCondition`)} />
                                                    </div>

                                                )}
                                            </div>

                                            {enrolleeExistingCondition == "true" && (

                                                <div className="flex flex-col lg:flex-row lg:gap-y-0 gap-y-3 justify-between lg:gap-x-3">
                                                    <div className="flex flex-col  lg:w-4/12">
                                                        <label>Condition Duration</label>
                                                        <input className="input-primary px-6 focus:outline-none" {...register(`enrollees.${index}.enrolleeConditionDuration`)} />
                                                            
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        <label>Condition Medication</label>
                                                        <input  className="input-primary px-6 focus:outline-none" {...register(`enrollees.${index}.enrolleeConditionMedication`)}  />
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <p onClick={() => remove(index)} className="cursor-pointer text-red-600 text-xs font-bold flex gap-x-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> <span>Remove Enrollee</span> </p>
                                            </div>
                                        </div>
                                    </div>
                                )})}


                            <div className="add-enrollees flex justify-end">
                                <p onClick={() => append({})} className="cursor-pointer color-primary text-base font-bold flex gap-x-2"><span><svg className="w-6 h-6" fill="none" stroke="#663391" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg></span>   <span>Add Enrollee</span> </p>
                            </div>

                            


                        </div>

                        <div className="flex gap-x-2 mb-3 mt-14 items-center"> 
                            <input type="checkbox" name="terms" id="terms" checked={terms} onChange={() => setterms(!terms)} />
                            <p className="text-black font-bold text-base">Agree to our<span className="color-primary"> Terms and conditions</span></p>
                        </div>

                        <div>
                            <button type="submit" className={"cursor-pointer individual-btn mb-14 " + (!terms && "opacity-50 cursor-not-allowed")}>Proceed</button>
                        </div>
                        
                    </form>
                ) : (
                    <div className="confirm-cover-details">
                        <div>
                            <h1 className="header mb-3">Plan Details</h1>
                            <div>
                                <p>{planDetails?.plan.planName}</p>
                            </div>

                            <h1 className="header mt-9 mb-10">Company Details</h1>

                            <table className="table-fixed w-full block md:hidden">
                                <tbody className="w-full table">
                                    <tr className="">
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Company Name</span>  <br /> <span className="text-black font-medium text-lg">{companyName}</span>  </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">RC Number</span>  <br /> <span className="text-black font-medium text-lg">{companyCAC}</span> </td>
                                    </tr>
                                    <tr>

                                        <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Company Email</span>  <br /> <span className="text-black font-medium text-lg">{companyEmail}</span> </td>
                                    </tr>
                                    <tr className="">
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Company Phone Number</span>  <br /> <span className="text-black font-medium text-lg">{companyPhone}</span> </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Industry</span>  <br /> <span className="text-black font-medium text-lg">{companyIndustry}</span> </td>
                                    </tr>

                                    <tr>
                                        
                                        <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Company Address</span>  <br /> <span className="text-black font-medium text-lg">{companyAddress}</span> </td>
                                    </tr>
                                  
                                    <tr>
                                        <td className="p-4 border border-gray-200" colSpan="3"><span className="color-primary font-semibold text-lg">Price</span>  <br /> <span className="text-black font-medium text-lg">N{planDetails?.plan.planAmount.amount}</span> </td>
                                    </tr>

                                    {enrolleeArray.length >= 1 && (
                                        <>
                                        {enrolleeArray.map((dependent, index) => (
                                            <>
                                            <tr className="bg-gray-300">
                                                <td className="p-3 font-semibold text-lg" colSpan="3">Enrollee Details - {index + 1}</td>
                                            </tr>
                                            <tr className="">
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">First Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.enrolleeFirstName}</span>  </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Last Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.enrolleeLastName}</span> </td>
                                            </tr>
                                            
                                            <tr className="">
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Gender</span>  <br /> <span className="text-black font-medium text-lg">{dependent.enrolleeGender}</span> </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">D.O.B</span>  <br /> <span className="text-black font-medium text-lg">{dependent.enrolleeDob}</span> </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Email</span>  <br /> <span className="text-black font-medium text-lg">{dependent.enrolleeEmail}</span> </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Phone Number</span>  <br /> <span className="text-black font-medium text-lg">{dependent.enrolleePhone}</span> </td>
                                                <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Address</span>  <br /> <span className="text-black font-medium text-lg">{dependent.enrolleeAddress}</span> </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200"  colSpan="3"><span className="color-primary font-semibold md:text-lg text-sm">Hospital Location</span>  <br /> <span className="text-black font-medium text-lg">{dependent.enrolleeHospital}</span> </td>
                                            </tr>
                                            </> 
                                        ))}

                                        </>
                                    )}
                                </tbody>
                            </table>

                            <table className="table-fixed w-full hidden md:block">
                                <tbody className="w-full table">
                                    <tr className="">
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Company Name</span>  <br /> <span className="text-black font-medium text-lg">{companyName}</span>  </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">RC Number</span>  <br /> <span className="text-black font-medium text-lg">{companyCAC}</span> </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Company Email</span>  <br /> <span className="text-black font-medium text-lg">{companyEmail}</span> </td>
                                    </tr>
                                    <tr className="">
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Company Phone Number</span>  <br /> <span className="text-black font-medium text-lg">{companyPhone}</span> </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Industry</span>  <br /> <span className="text-black font-medium text-lg">{companyIndustry}</span> </td>
                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold text-lg">Company Address</span>  <br /> <span className="text-black font-medium text-lg">{companyAddress}</span> </td>
                                    </tr>
                                  
                                    <tr>
                                        <td className="p-4 border border-gray-200" colSpan="3"><span className="color-primary font-semibold text-lg">Price</span>  <br /> <span className="text-black font-medium text-lg">N{planDetails?.plan.planAmount.amount}</span> </td>
                                    </tr>

                                    {enrolleeArray.length >= 1 && (
                                        <>
                                        {enrolleeArray.map((dependent, index) => (
                                            <>
                                            <tr className="bg-gray-300">
                                                <td className="p-3 font-semibold text-lg" colSpan="3">Enrollee Details - {index + 1}</td>
                                            </tr>
                                            <tr className="">
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">First Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.firstname}</span>  </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Last Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.lastname}</span> </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Gender</span>  <br /> <span className="text-black font-medium text-lg">{dependent.gender}</span> </td>
                                            </tr>
                                            
                                            <tr className="">
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">D.O.B</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dob}</span> </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Phone Number</span>  <br /> <span className="text-black font-medium text-lg">{dependent.phone}</span> </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Email</span>  <br /> <span className="text-black font-medium text-lg">{dependent.email}</span> </td>
                                            </tr>
                                            
                                            <tr>
                                                <td className="p-4 border border-gray-200" colSpan="3"><span className="color-primary font-semibold md:text-base text-sm">Address</span>  <br /> <span className="text-black font-medium text-lg">{dependent.address}</span> </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200"  colSpan="3"><span className="color-primary font-semibold md:text-lg text-sm">Hospital Location</span>  <br /> <span className="text-black font-medium text-lg">{dependent.hospital}</span> </td>
                                            </tr>
                                            </> 
                                        ))}

                                        </>
                                    )}
                                </tbody>
                            </table>

                            <div className="flex gap-4">
                                <input type="button" value="back" className="back-btn cursor-pointer mt-14 mb-14 uppercase" onClick={goBack} />
                                <button 
                                onClick={() => {
                                buyPlan()
                                
                                }}
                                    type="button" className="individual-btn mt-14 mb-14 uppercase">{isloadingPayment ? (<Spinner name="circle" color='#fff' fadeIn='none' />) : ("Make Payment")}</button>
                            </div>
                            
                        </div>
                    </div>
                )}                        
                </div>
            </div>

            )}

        </div>
    )
}

export default SMELoan
