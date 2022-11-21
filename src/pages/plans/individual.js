import React, { useEffect, useState, Fragment } from 'react'
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Banner from './shared/banner'
import user from '../../assets/img/vector.svg'
import './plans.css'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useHistory } from 'react-router-dom';

var Spinner = require('react-spinkit');


function Individual() {
    //Routing
    const history = useHistory();
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
        name: "dependants"
      });
    
    
    


    //Notif
    const paymentSuccess = () => toast.success('Payment Successfull', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "toastify"
        });

    //Hooks
    const [confrimDetail, setconfrimDetail] = useState(false)
    const [planDetails, setplanDetails] = useState(null)
    const [initialPageName, setinitialPageName] = useState("Individual Plan")


    const [isloading, setisloading] = useState(false)
    const [isloadingPayment, setisloadingPayment] = useState(false)
    const [error, seterror] = useState(null)

    const [hospitalArray, sethospitalArray] = useState([])
    const [dependantHospitalArray, setdependantHospitalArray] = useState([])


    //Form values
    const [imgData, setimgData] = useState(null)
    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [mname, setmname] = useState("")
    const [email, setemail] = useState("")
    const [phone, setphone] = useState("")
    const [gender, setgender] = useState("")
    const [dob, setdob] = useState("")
    const [address, setaddress] = useState("")
    const [hospital, sethospital] = useState("")
    const [hospitalAddress, sethospitalAddress] = useState("")
    const [exisitingCondition, setexisitingCondition] = useState("false")
    const [healthCondition, sethealthCondition] = useState("")
    const [conditionDuration, setconditionDuration] = useState(new Date())
    const [conditionMedication, setconditionMedication] = useState("")

    const [dependentArray, setdependentArray] = useState([])
    const [dependantExistingCondition, setdependantExistingCondition] = useState("false")
    const [dependanthospitalAddress, setdependanthospitalAddress] = useState("")
    const [dependantConditionDuration, setdependantConditionDuration] = useState(new Date())
    const [dependantImgArray, setdependantImgArray] = useState([])
    // console.log(new Date().toLocaleDateString())
    // console.log(watch("dateInput"));

    // let newArr = [];
    



    useEffect(() => {
        getPlanDetails()
        return () => {
            getPlanDetails()
        }
    }, [])
    //End of Hooks


    //Functions
    const chooseImage = () => {
        document.getElementById('photo').click();  
        
    }
    
    function encodeImageFileAsURL() {

        var filesSelected = document.getElementById("photo").files;
        if (filesSelected.length > 0) {
          var fileToLoad = filesSelected[0];
    
          var fileReader = new FileReader();
    
          fileReader.onload = function(fileLoadedEvent) {
            setimgData(fileLoadedEvent.target.result);
          }
          fileReader.readAsDataURL(fileToLoad);
        }
    }

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
            setdependantImgArray([...dependantImgArray, fileLoadedEvent.target.result])
          }
          fileReader.readAsDataURL(fileToLoad);
        }
    }



    const submitForm = (data) => {
        console.log(fields)
        if(fields.length && !dependantImgArray.length) {
            toast.error("Dependant Image is missing")
            return
        }
        if(fields.length !== dependantImgArray.length) {
            toast.error("Dependant Image is missing")
            return
        }
        if(!imgData) {
            toast.error("Image is missing")
            return
        }
        // // e.preventDefault()
        // console.log(data?.dependants)
        // console.log(control)
        setdependentArray(data?.dependants.map(person => ({ 
            dependantFirstName: person.dependantFirstName,
            dependantLastName: person.dependantLastName,
            dependantMiddleName: person.dependantMiddleName,
            dependantEmail: person.dependantEmail,
            dependantPhoneNumber: person.dependantPhoneNumber,
            dependantGender: person.dependantGender,
            dependantDob: person.dependantDob?.toLocaleDateString(),
            dependantAddress: person.dependantAddress,
            dependantHospital: person.dependantHospital,
            dependantHospitalAddress: person.dependantHospitalAddress,
            dependantExistingConditions: person.existingCondition,
            dependantCondition: person.existingCondition == "true" ? {
                healthCondition: person.healthCondition,
                healthConditionDuration: person.dependantConditionDuration?.toLocaleDateString(),
                healthConditionMedication: person.conditionMedication
            } : ""

        })))
        // // setdependentArray(data.dependants.map())

        setinitialPageName("Confirm Details")
        setconfrimDetail(true)
        // console.log(newArr[0])
    

    }

    const getPlanDetails = () => {
        // console.log(process.env.REACT_APP_API_KEY)
        setisloading(true)
        seterror(false)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_API_KEY}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + "plans/22", requestOptions)
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


    const buyPlan = () => {
        setisloadingPayment(true)
        seterror(null)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_API_KEY}`);

        const obj = {
            plan: 22,
            entity: {
                "firstname": fname,
                "lastname": lname,
                "email": email,
                "phone": phone,
                "gender": gender,
                "dob": dob,
                "address": address,
                "hospital": `${hospital} - ${hospitalAddress}`,
                "photo": `${imgData}`,
                "agreement": true,
                "existingConditions": exisitingCondition,
                "condition": exisitingCondition == "true" ? {
                "healthCondition": healthCondition,
                "healthConditionDuration": conditionDuration,
                "healthConditionMedication": conditionMedication
                } : ""
            },
            dependants: dependentArray

        }

        if(!dependentArray.length) {
            delete obj.dependants
        }

        console.log(obj)

    

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(obj),
        redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + "buy-plan", requestOptions)
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
        myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_API_KEY}`);
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

        fetch(process.env.REACT_APP_BASE_URL + "buy-plan/payment", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if(result.status) {
                window.location.assign(result.data.link)
            }
        })
        .catch(error => console.log('error', error));
    }

    const populateAddress = () => {
        const datalist = document.getElementById('hospital')
        const inputList = document.getElementById('hospital-name')
        let step;
    
        for (var i=0;i<datalist.options.length;i++) {
          if (datalist.options[i].value == inputList.value) {
              console.log(datalist.options[i]);
              step = i;
            //   console.log(i);
              sethospitalAddress(hospitalArray[step].address)
              break;
          }
        }
    }

    const populateDependantAddress = (index) => {
        const datalist = document.getElementById(`dependanthospital${index}`)
        const inputList = document.getElementById(`dependantHospital-name${index}`)
        let step;
    
        for (var i=0;i<datalist.options.length;i++) {
          if (datalist.options[i].value == inputList.value) {
              step = i;
                setdependanthospitalAddress(dependantHospitalArray[step].address)
              break;
          }
        }
    }

    const sethospitalDetail = (val) => {
        // console.log(val);
        const newArray = planDetails.providers.filter((provider) => {
            return provider.location == val
        })
        // console.log(newArray);
        sethospitalArray(newArray);
    }

    const setdependantHospitalDetail = (val) => {
        // console.log(val);
        const newArray = planDetails.providers.filter((provider) => {
            return provider.location == val
        })
        // console.log(newArray);
        setdependantHospitalArray(newArray);
    }

    const goBack = () => {
        setinitialPageName("Individual Plan")
        setconfrimDetail(false)

    }

    function isNumber(e) {
        

        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex

        if (e === '' || re.test(e)) {
            setphone(e)
        }
    }


    //End of Functions

    return (
        <div>
            <ToastContainer />
            <Banner bannerHeader={initialPageName}></Banner>
            
            {isloading ? (
                <div className='px-40 h-screen text-center'>
                    <Spinner className='loader' name='circle' fadeIn='none' color='#8e2b8d' />

                </div>
            ) : (
                <div className="">
                    <div className="form">
                        {!confrimDetail ? (
                            <form onSubmit={handleSubmit(submitForm)} className="lg:px-64 px-8 pt-28 font-primary">
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
                                                <li className="leading-tight items-center flex mb-2 gap-x-1"><svg className="w-6 h-6" fill="none" stroke={planDetails?.plan.planBenefits.specialist_consultation ? "#00B252" : "#f00"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={planDetails?.plan.planBenefits.specialist_consultation ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path></svg> <span>Specialist Consultation</span> </li>
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


                                <h1 className="header mt-24 mb-5">Personal Details</h1>

                                <div className="mb-10">
                                    <label htmlFor="photo"></label>
                                    <input className="input-primary px-6 hidden" type="file" onChange={() => encodeImageFileAsURL()} name="photo" id="photo" />
                                    <div className="flex gap-x-2 lg:w-2/6 w-full cursor-pointer items-center" onClick={() => {chooseImage()}}>
                                        <img src={imgData ? imgData : user} alt="db" width="68px" height="68px"/>
                                        <p className="text-sm font-medium">Tap to upload image</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-6 mb-10">
                                    <div className="flex w-full flex-wrap justify-between lg:gap-x-6 gap-y-3 lg:gap-y-0">
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="first-name">First Name</label>
                                            <input value={fname} onChange={(e) => setfname(e.target.value)} className="input-primary px-6 focus:outline-none" type="text" name="first-name" id="first-name" required />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="last-name">Last Name</label>
                                            <input value={lname} onChange={(e) => setlname(e.target.value)}  className="input-primary px-6 focus:outline-none" type="text" name="last-name" id="last-name" required />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="middle-name">Middle Name</label>
                                            <input value={mname} onChange={(e) => setmname(e.target.value)}  className="input-primary px-6 focus:outline-none" type="text" name="middle-name" id="middle-name" required />
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row justify-between lg:gap-x-6 lg:gap-y-0 gap-y-3">
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="gender">Gender</label>
                                            <select name="gender" id="gender" className="px-6 focus:outline-none" value={gender} onChange={(e) => setgender(e.target.value)} required>
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="dob">D.O.B</label>
                                            <DatePicker selected={dob} onChange={(date) => setdob(date)} className="entity-dob" showYearDropdown scrollableYearDropdown yearDropdownItemNumber={200} maxDate={new Date()} />
                                            {/* <input value={dob} onChange={(e) => setdob(e.target.value)} className="input-primary px-6 focus:outline-none" type="text" name="dob" id="dob" /> */}
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="email">Email</label>
                                            <input value={email} onChange={(e) => setemail(e.target.value)}  className="input-primary px-6 focus:outline-none" type="email" name="email" id="email" required />
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:gap-y-0 gap-y-3 justify-between lg:gap-x-6">
                                        <div className="flex flex-col lg:w-4/12 ">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input value={phone} onChange={(e) => isNumber(e.target.value)}  className="input-primary px-6 focus:outline-none" type="tel" name="phone" id="phone" required maxLength={11} />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="address">Address</label>
                                            <input value={address} onChange={(e) => setaddress(e.target.value)}  className="input-primary px-6 focus:outline-none" type="text" name="address" id="address" required />
                                        </div>
                                    </div>

                                    <h1 className="header">Hospital Details</h1>

                                    <div className="flex w-full flex-wrap justify-between lg:gap-x-6 gap-y-3 lg:gap-y-0">
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="location">Location</label>
                                            <select name="state" id="state" className="px-6 focus:outline-none" onChange={(e) => sethospitalDetail(e.target.value)} required>
                                                <option>Select Location</option>
                                                {planDetails?.locations.map((state, index) => (
                                                    <option key={index} value={state.location}>{state.location}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="hospital">Name</label>
                                            <input value={hospital} onChange={(e) => sethospital(e.target.value)}  onBlur={populateAddress} className="input-primary px-6 focus:outline-none" type="text" name="hospital-name" id="hospital-name" list="hospital" required />
                                            <datalist id="hospital">
                                                {hospitalArray.map((hospital, index) => (
                                                    <option key={index} value={hospital.name}>{hospital.name}</option>
                                                ))}
                                            </datalist>
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <label htmlFor="hospital">Address</label>
                                            <input value={hospitalAddress} onChange={(e) => sethospitalAddress(e.target.value)}  className="input-primary px-6 focus:outline-none" type="text" list="hospitalAddress" name="hospitalAddress" id="hospitalAddress-list" required />
                                            <datalist id="hospitalAddress">
                                                {hospitalArray.map((hospital, index) => (
                                                    <option key={index} value={hospital.address}>{hospital.address}</option>
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>

                                    <h1 className="header">Condition </h1>

                                    <div className="flex flex-col lg:flex-row lg:gap-y-0 gap-y-3 justify-between lg:gap-x-6">
                                        <div className="flex flex-col  lg:w-4/12">
                                            <label htmlFor="exisiting-condition">Existing Condition</label>
                                            <select name="exisiting-condition" id="exisiting-condition" className="px-6 focus:outline-none" value={exisitingCondition} onChange={(e) => setexisitingCondition(e.target.value)}>
                                                <option value={"true"}>Yes</option>
                                                <option value={"false"}>No</option>
                                            </select>
                                        </div>
                                        {exisitingCondition == "true" && (
                                            <div className="flex flex-col flex-1">
                                                <label htmlFor="health-condition">Health Condition</label>
                                                <input value={healthCondition} onChange={(e) => sethealthCondition(e.target.value)}   className="input-primary px-6 focus:outline-none" type="text" name="health-condition" id="health-condition" required />
                                            </div>

                                            )
                                        }
                                    </div>

                                    {exisitingCondition == "true" && (

                                            <div className="flex flex-col lg:flex-row lg:gap-y-0 gap-y-3 justify-between lg:gap-x-6">
                                                <div className="flex flex-col  lg:w-4/12">
                                                    <label htmlFor="condition-duration">Date of Diagnosis</label>
                                                    {/* <input name="condition-duration" id="condition-duration" className="input-primary px-6 focus:outline-none" value={conditionDuration} onChange={(e) => setconditionDuration(e.target.value)} /> */}
                                                    <DatePicker selected={conditionDuration} onChange={(date) => setconditionDuration(date)} className="entity-dob" showYearDropdown scrollableYearDropdown yearDropdownItemNumber={200} maxDate={new Date()} />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label htmlFor="condition-medication">Current Medication</label>
                                                    <input value={conditionMedication} onChange={(e) => setconditionMedication(e.target.value)}   className="input-primary px-6 focus:outline-none" type="text" name="condition-medication" id="condition-medication" required />
                                                </div>
                                            </div>
                                        )
                                    }



                                </div>
                                

                                <hr />


                                {fields.map((field, index) => {
                                    return (
                                    <div key={field.id} className="mb-20">
                                        <h1 className="header mt-9 mb-10">Dependant Details {`- ${index + 1}`}</h1>
                                        <div className="flex flex-col gap-y-6">
                                            <div>
                                                <label htmlFor="photo"></label>
                                                <input {...register(`dependants.${index}.dependantPhoto`)} className="input-primary px-6 hidden" type="file" onChange={() => dependantEncodeImageFileAsURL(index)} name={`dependantphoto-${index + 1}`} id={`dependantphoto-${index + 1}`} />
                                                <div className="flex gap-x-2 lg:w-2/6 w-full cursor-pointer items-center" onClick={(e) => {dependantChooseImage(index, e)}}>
                                                    <img src={(dependantImgArray.length && dependantImgArray[index]) ? dependantImgArray[index] : user} alt="db" width="68px" height="68px"/>
                                                    <p className="text-sm font-medium">Tap to upload image</p>
                                                </div>
                                            </div>
                                            <div className="flex w-full flex-wrap justify-between lg:gap-x-3 gap-y-3 lg:gap-y-0">
                                                <div className="flex flex-col flex-1">
                                                    <label>First Name</label>
                                                    <input {...register(`dependants.${index}.dependantFirstName`, {required: true})} control={control} className="input-primary px-6 focus:outline-none" type="text"  />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Last Name</label>
                                                    <input defaultValue={lname} {...register(`dependants.${index}.dependantLastName`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Middle Name</label>
                                                    <input  {...register(`dependants.${index}.dependantMiddleName`, {required: true})} className="input-primary px-6 focus:outline-none" type="text"  />
                                                </div>
                                            </div>

                                            <div className="flex flex-col lg:flex-row justify-between lg:gap-x-3 lg:gap-y-0 gap-y-3">
                                                <div className="flex flex-col flex-1">
                                                    <label>Gender</label>
                                                    <select {...register(`dependants.${index}.dependantGender`)} className="px-6 focus:outline-none" required>
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>D.O.B</label>
                                                    <Controller
                                                        render={({ field }) => <DatePicker onChange={(date) => field.onChange(date)}
                                                        selected={field.value} className="entity-dob" 
                                                        showYearDropdown scrollableYearDropdown yearDropdownItemNumber={200} maxDate={new Date()} />}
                                                        name={`dependants.${index}.dependantDob`}
                                                        control={control}
                                                    />
                                                    
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Email</label>
                                                    <input defaultValue={email} {...register(`dependants.${index}.dependantEmail`, {required: true})} className="input-primary px-6 focus:outline-none" type="email" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col lg:flex-row lg:gap-x-3 lg:gap-y-0 justify-between gap-y-3">
                                                <div className="flex flex-col lg:w-4/12">
                                                    <label>Phone Number</label>
                                                    <input defaultValue={phone} {...register(`dependants.${index}.dependantPhoneNumber`, {required: true})} className="input-primary px-6 focus:outline-none" type="number" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Address</label>
                                                    <input defaultValue={address}  {...register(`dependants.${index}.dependantAddress`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" />
                                                </div>
                                            </div>

                                            <h1 className="header">Dependant {`${index + 1}`} Hospital Details</h1>

                                            <div className="flex w-full flex-wrap justify-between lg:gap-x-6 gap-y-3 lg:gap-y-0">
                                                <div className="flex flex-col flex-1">
                                                    <label htmlFor="location">Location</label>
                                                    <select name="state" id="state" className="px-6 focus:outline-none" onChange={(e) => setdependantHospitalDetail(e.target.value)}>
                                                        <option>Select Location</option>
                                                        {planDetails?.locations.map((state, index) => (
                                                            <option key={index} value={state.location}>{state.location}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Name</label>
                                                    {/* <input defaultValue={hospital} {...register(`dependants.${index}.dependantHospital`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" /> */}
                                                    <input {...register(`dependants.${index}.dependantHospital`, {required: true})}  onBlur={() => populateDependantAddress(index)} className="input-primary px-6 focus:outline-none" type="text" id={"dependantHospital-name" + index} list={"dependanthospital" + index} required />
                                                    <datalist id={"dependanthospital" + index}>
                                                        {dependantHospitalArray.map((hospital, index) => (
                                                            <option key={index} value={hospital.name}>{hospital.name}</option>
                                                        ))}
                                                    </datalist>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label>Address</label>
                                                    {/* <input defaultValue={hospitalAddress} {...register(`dependants.${index}.dependantHospitalAddress`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" /> */}
                                                    <input value={dependanthospitalAddress} {...register(`dependants.${index}.dependantHospitalAddress`, {required: true})} className="input-primary px-6 focus:outline-none" type="text" list="dependantHospitalAddress" id="dependanthospitalAddress-list" required />
                                                    <datalist id="dependantHospitalAddress">
                                                        {dependantHospitalArray.map((hospital, index) => (
                                                            <option key={index} value={hospital.address}>{hospital.address}</option>
                                                        ))}
                                                    </datalist>
                                                </div>
                                            </div>

                                            <h1 className="header">Dependant {`${index + 1}`} Condition </h1>

                                            <div className="flex flex-col lg:flex-row lg:gap-y-0 gap-y-3 justify-between lg:gap-x-3">
                                                <div className="flex flex-col  lg:w-4/12">
                                                    <label htmlFor="exisiting-condition">Existing Condition</label>
                                                    <select 
                                                    name="existingCondition" 
                                                    id="existingCondition" 
                                                    className="px-6 focus:outline-none" 
                                                    {...register(`dependants.${index}.existingCondition`, {
                                                        value: dependantExistingCondition,
                                                        onChange: (e) => setdependantExistingCondition(e.target.value)
                                                    })}>
                                                        <option value={"true"}>Yes</option>
                                                        <option value={"false"}>No</option>
                                                    </select>
                                                </div>
                                                {dependantExistingCondition == "true" && (
                                                    <div className="flex flex-col flex-1">
                                                        <label htmlFor="health-condition">Health Condition</label>
                                                        <input  className="input-primary px-6 focus:outline-none" name="health-condition" id="health-condition" {...register(`dependants.${index}.healthCondition`, {required: true})} />
                                                    </div>

                                                )}
                                            </div>

                                            {dependantExistingCondition == "true" && (

                                                <div className="flex flex-col lg:flex-row lg:gap-y-0 gap-y-3 justify-between lg:gap-x-3">
                                                    <div className="flex flex-col  lg:w-4/12">
                                                        <label htmlFor="condition-duration">Date of Diagnosis</label>
                                                        <Controller
                                                            render={({ field }) => <DatePicker onChange={(date) => field.onChange(date)}
                                                            selected={field.value} className="entity-dob" 
                                                            showYearDropdown scrollableYearDropdown yearDropdownItemNumber={200} maxDate={new Date()} />}
                                                            name={`dependants.${index}.dependantConditionDuration`}
                                                            control={control}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        <label htmlFor="condition-medication">Current Medication</label>
                                                        <input  className="input-primary px-6 focus:outline-none" name="condition-medication" id="condition-medication" {...register(`dependants.${index}.conditionMedication`, {required: true})}  />
                                                    </div>
                                                </div>
                                            )}

                                            
                                            <div>
                                                <p onClick={() => remove(index)} className="cursor-pointer text-red-600 text-xs font-bold flex gap-x-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> <span>Remove Dependant</span> </p>
                                            </div>

                                        

                                        </div>
                                    </div>
                                )})}


                                <div className="add-enrollees flex mt-10">
                                    <p onClick={() => append({})} className="cursor-pointer color-primary text-base font-bold flex gap-x-2"><span><svg className="w-6 h-6" fill="none" stroke="#663391" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg></span>   <span>Add Dependants</span> </p>
                                </div>

                                <div className="flex gap-4">
                                    <input type="button" value="back" className="back-btn cursor-pointer mt-14 mb-14 uppercase" onClick={() => history.goBack()} />
                                    
                                    <input type="submit" className="cursor-pointer individual-btn mt-14 mb-14 uppercase" />
                                </div>
                                
                            </form>

                        ) : (
                            <div className="confirm-cover-details xl:px-64 lg:px-80 px-8 pt-28 bg-gray-100 font-primary">
                                <div>
                                    <div className="mb-16 text-center">
                                        <div className="userdp overflow-hidden w-48 h-48 rounded-full bg-white border text-center inline-block">
                                            {imgData ? (
                                            <img src={imgData} alt="db" className="w-full h-full object-cover" />
                                            ) : (
                                                <p className="mt-16">No Image</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-center mb-16">
                                        <h1 className="header mb-3">Plan Details</h1>
                                        <p className="text-2xl font-medium">{planDetails?.plan.planName}</p>
                                    </div>
                                    <table className="table-fixed w-full md:hidden block bg-white">
                                        <tbody className="w-full table">
                                            <tr className="">
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-base">First Name</span>  <br /> <span className="text-black font-medium text-xl">{fname}</span>  </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-base">Last Name</span>  <br /> <span className="text-black font-medium text-2xl">{lname}</span> </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-base">Middle Name</span>  <br /> <span className="text-black font-medium text-lg">{mname}</span> </td>

                                            </tr>
                                            <tr className="">
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-base">Gender</span>  <br /> <span className="text-black font-medium text-lg">{gender}</span> </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-base">D.O.B</span>  <br /> <span className="text-black font-medium text-lg">{dob.toLocaleDateString()}</span> </td>
                                            </tr>
                                            <tr>

                                                <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-base">Email</span>  <br /> <span className="text-black font-medium text-lg">{email}</span> </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-base">Phone Number</span>  <br /> <span className="text-black font-medium text-lg">{phone}</span> </td>
                                                <td className="p-4 border border-gray-200" colSpan="2"><span className="color-primary font-semibold md:text-lg text-base">Address</span>  <br /> <span className="text-black font-medium text-lg">{address}</span> </td>
                                            </tr>
                                            <tr className="bg-gray-300">
                                                <td className="p-3 font-semibold text-lg" colSpan="3">Hospital Details</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-base">Location</span>  <br /> <span className="text-black font-medium text-lg">{hospitalAddress}</span> </td>
                                                <td className="p-4 border border-gray-200" colSpan="2"><span className="color-primary font-semibold md:text-lg text-base">Hospital</span>  <br /> <span className="text-black font-medium text-lg">{hospital}</span> </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200" colSpan="3"><span className="color-primary font-semibold md:text-lg text-base">Price</span>  <br /> <span className="text-black font-medium text-lg">N{dependentArray.length >= 1 ? (dependentArray.length + 1) * Number(planDetails?.plan.planAmount.amount) : planDetails?.plan.planAmount.amount}</span> </td>
                                            </tr>
                                            {dependentArray.length >= 1 && (
                                                <>
                                                {dependentArray.map((dependent, index) => (
                                                    <Fragment key={index}>
                                                    <tr className="bg-gray-300">
                                                        <td className="p-3 font-semibold text-lg" colSpan="3">Dependant Details - {index + 1}</td>
                                                    </tr>
                                                    <tr className="">
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">First Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantFirstName}</span>  </td>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Last Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantLastName}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Middle Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantMiddleName}</span> </td>
                                                    </tr>
                                                    <tr className="">
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Gender</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantGender}</span> </td>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">D.O.B</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantDob}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Email</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantEmail}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Phone Number</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantPhoneNumber}</span> </td>
                                                        <td colSpan="2" className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Address</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantAddress}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-sm">Hospital Location</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantHospitalAddress}</span> </td>
                                                        <td className="p-4 border border-gray-200" colSpan="2"><span className="color-primary font-semibold md:text-base text-sm">Hospital Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantHospital}</span> </td>
                                                    </tr>
                                                    </Fragment> 
                                                ))}

                                                </>
                                            )}
                                        </tbody>
                                    </table>

                                    <table className="table-fixed w-full hidden md:block bg-white">
                                        <tbody className="w-full table">
                                            <tr className="">
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">First Name</span>  <br /> <span className="text-black font-medium text-lg">{fname}</span>  </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Last Name</span>  <br /> <span className="text-black font-medium text-lg">{lname}</span> </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Middle Name</span>  <br /> <span className="text-black font-medium text-lg">{mname}</span> </td>
                                            </tr>
                                            <tr className="">
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Gender</span>  <br /> <span className="text-black font-medium text-lg">{gender}</span> </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">D.O.B</span>  <br /> <span className="text-black font-medium text-lg">{dob.toLocaleDateString()}</span> </td>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Email</span>  <br /> <span className="text-black font-medium text-lg">{email}</span> </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Phone Number</span>  <br /> <span className="text-black font-medium text-lg">{phone}</span> </td>
                                                <td className="p-4 border border-gray-200" colSpan="2"><span className="color-primary font-semibold md:text-base text-sm">Address</span>  <br /> <span className="text-black font-medium text-lg">{address}</span> </td>
                                            </tr>
                                            <tr className="bg-gray-300">
                                                <td className="p-3 font-semibold text-lg" colSpan="3">Hospital Details</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-sm">Location</span>  <br /> <span className="text-black font-medium text-lg">{hospitalAddress}</span> </td>
                                                <td className="p-4 border border-gray-200" colSpan="2"><span className="color-primary font-semibold md:text-base text-sm">Hospital</span>  <br /> <span className="text-black font-medium text-lg">{hospital}</span> </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200" colSpan="3"><span className="color-primary font-semibold md:text-base text-sm">Price</span>  <br /> <span className="text-black font-medium text-lg">N{dependentArray.length >= 1 ? (dependentArray.length + 1) * Number(planDetails?.plan.planAmount.amount) : planDetails?.plan.planAmount.amount}</span> </td>
                                            </tr>

                                            {dependentArray.length >= 1 && (
                                                <>
                                                {dependentArray.map((dependent, index) => (
                                                    <Fragment key={index}>
                                                    <tr className="bg-gray-300">
                                                        <td className="p-3 font-semibold text-lg" colSpan="3">Dependant Details - {index + 1}</td>
                                                    </tr>
                                                    <tr className="">
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">First Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantFirstName}</span>  </td>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Last Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantLastName}</span> </td>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Middle Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantMiddleName}</span> </td>
                                                    </tr>
                                                    <tr className="">
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Gender</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantGender}</span> </td>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">D.O.B</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantDob}</span> </td>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Email</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantEmail}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-base text-sm">Phone Number</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantPhoneNumber}</span> </td>
                                                        <td className="p-4 border border-gray-200" colSpan="2"><span className="color-primary font-semibold md:text-base text-sm">Address</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantAddress}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4 border border-gray-200"><span className="color-primary font-semibold md:text-lg text-sm">Hospital Location</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantHospitalAddress}</span> </td>
                                                        <td className="p-4 border border-gray-200" colSpan="2"><span className="color-primary font-semibold md:text-base text-sm">Hospital Name</span>  <br /> <span className="text-black font-medium text-lg">{dependent.dependantHospital}</span> </td>
                                                    </tr>
                                                    </Fragment> 
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

export default Individual
