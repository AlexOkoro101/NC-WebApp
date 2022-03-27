import React from 'react'
import { useHistory, Link } from 'react-router-dom'
import CustomerExpectation from '../../components/sections/customer-expectation'
import InsurancePackage from '../../components/sections/insurance-package'
import OyoAgency from '../../components/sections/oyo-agency'
import ReadyTalk from '../../components/sections/ready-talk'
import Testimonials from '../../components/sections/testimonials'
import './home.css'
import image1 from "../../assets/img/health-insurance2.svg"
import image2 from "../../assets/img/health-insurance1.svg"
import image3 from "../../assets/img/health-insurance3.svg"

function Home() {
    const history = useHistory()


    return (
        <div className="home font-primary">
            <div className="home-banner">
                <div className="banner-content flex flex-col justify-center lg:px-64 md:pt-40 md:pb-40 px-8 pt-20 pb-32 sm:pt-20 sm:pb-40 text-center">
                    <h1 style={{lineHeight: "3rem"}} className="text-white lg:text-3xl text-2xl font-extrabold">Buy affordable health insurance <br /> products across Africa for </h1>
                    <h1 style={{lineHeight: "3rem"}} className="text-white lg:text-3xl text-2xl font-extrabold mb-16">YOU, YOUR FAMILY, YOUR DEPENDANTS <br /> and <span style={{color: "#ffea2f"}}>YOUR EMPLOYEES</span></h1>
                </div>
            </div>

            <div className="services lg:px-40 md:px-20 p-8 pb-24">
                <div className="flex flex-col gap-y-8 sm:flex-row justify-between -mt-32">
                    <div className="bg-white shadow-lg rounded-3xl text-center p-8 service-item">
                        <img src={image1} alt="" className="inline mb-4" />
                        <p className="font-bold text-2xl line leading-6">I don’t have</p>
                        <p className="mb-3 font-bold text-2xl leading-6"> a health plan</p>
                        <p className="font-medium text-xs">Click on the button below <br /> to get started</p>
                        <Link onClick={() => localStorage.setItem('type', 'default')} to='/buy-cover' className="new-button2 mt-8 rounded-xl m-auto text-sm inline-block">Get Started</Link>
                    </div>

                    <div className="bg-white shadow-lg rounded-3xl text-center p-8 service-item">
                        <img src={image2} alt="" className="inline mb-4" />
                        <p className="font-bold text-2xl line leading-6">I have an expiring</p>
                        <p className="mb-3 font-bold text-2xl leading-6"> health plan</p>
                        <p className="font-medium text-xs">Go on and click the button <br /> below to renew your plan </p>
                        <Link to='/buy-cover/renew' className="new-button2 mt-8 rounded-xl m-auto text-sm inline-block">Renew Plan</Link>
                    </div>

                    <div className="bg-white shadow-lg rounded-3xl text-center p-8 service-item">
                        <img src={image3} alt="" className="inline mb-4" />
                        <p className="font-bold text-2xl line leading-6">I can't afford</p>
                        <p className="mb-3 font-bold text-2xl leading-6"> a health plan</p>
                        <p className="font-medium text-xs">Don’t worry much, click  on <br /> the button below to buy and pay later</p>
                        <Link  onClick={() => localStorage.setItem('type', 'loan')} to='/buy-cover' className="new-button2 mt-8 rounded-xl m-auto text-sm inline-block">Get a Loan Now</Link>
                    </div>
                </div>
            </div>

            {/* Ready to talk */}
            {/* <ReadyTalk></ReadyTalk> */}

            {/* insurance info section */}
            <InsurancePackage></InsurancePackage>

            {/* Oyo insurance agency */}
            <OyoAgency></OyoAgency>

            <div className="lg:px-40 px-8 bg-primary font-primary">
                <div className="text-center">
                    <div className="header pt-20 pb-20">
                        <p className="pt-9 font-extrabold text-3xl mb-1 text-white">Ready to Talk?</p>
                        {/* <p className="font-medium text-xs text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris</p> */}

                        <button onClick={() => window.location.href = 'https://nucleusis.io/contact-us/'} className="contact-us-btn">Contact Us</button>

                        <p className="text-xl font-medium contact-stats">More that 1.5 million individuals use NucleusIS</p>

                    </div>
                </div>
            </div>

            {/* Customer Expectation */}
            {/* <CustomerExpectation></CustomerExpectation> */}

            {/* Testimonies */}
            {/* <Testimonials></Testimonials> */}

        </div>
    )
}

export default Home
