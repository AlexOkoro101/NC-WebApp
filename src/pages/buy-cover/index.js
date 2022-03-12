import React, { useEffect, useState } from 'react'
import './buycover.css'
import buycover1 from '../../assets/img/indiv.jpg';
import buycover2 from '../../assets/img/fam.jpg';
import buycover3 from '../../assets/img/sme.jpg';
import buycover4 from '../../assets/img/elderly.jpg';
import lshs from '../../assets/img/lshs.png';
import oyo from '../../assets/img/oyo.png';
import Ready from '../../components/sections/ready';
import { useHistory, Link } from 'react-router-dom';

function BuyCover() {
    const history = useHistory()
    const [type, settype] = useState(null)

    useEffect(() => {
        const type = localStorage.getItem('type')
        if(type) {
            settype(type)
        }
    }, [])

    return (
        <div className="buy-cover mt-24 font-primary">
            <div className="text-center">
                <div className="header text-center mb-16">
                    <p className="font-bold text-2xl mb-14">Private health <br /> Insurance Packages</p>
                    {/* <p className="font-medium insurance-caption">Lorem ipsum dolor sit amet, <br /> consectetur adipiscing elit.</p> */}
                </div>
                <div className="flex flex-col lg:flex-row justify-around lg:gap-20 gap-10 lg:px-80 px-8 lg:mb-44 mb-14">
                    <div className="w-full">
                        <div className="w-full h-48  rounded-3xl overflow-hidden">
                            <img loading="lazy" src={buycover1} alt="buycover"  className="inline-block h-full w-full object-cover" />
                        </div>
                        <p className="mt-6 text-black font-bold text-2xl mb-6">Young Professional</p>
                        <p className="text-black buycover-cap font-medium mb-6">you work hard and maybe play a little harder. You can’t afford to leave your health to chance. Get a plan that fits your lifestyle today. </p>
                        {type == 'loan' ? (
                            <Link to='/buy-cover/individual-loan' className="individual-btn mt-14 mb-14 ">Get Started</Link>
                        ) : type == 'lagos' ? (
                            <Link to='/buy-cover/lagos/individual' className="individual-btn mt-14 mb-14">Get Started</Link>
                        ): type == 'oyo' ? (
                            <Link to='/buy-cover/oyo/individual' className="individual-btn mt-14 mb-14">Get Started</Link>
                        ) : (
                            <Link to='/buy-cover/individual' className="individual-btn mt-14 mb-14">Get Started</Link>
                        )}
                    </div>
                    <div className="w-full">
                        <div className="w-full h-48  rounded-3xl overflow-hidden">
                            <img loading="lazy" src={buycover2} alt="buycover"  className="inline-block h-full w-full object-cover" />
                        </div>
                        <p className="mt-6 text-black font-bold text-2xl mb-6">Family</p>
                        <p className="text-black buycover-cap font-medium mb-6">We live for our loved ones and love to always see them smile. We have plans designed to keep every member of the family smiling. </p>
                        
                        {type == 'loan' ? (
                            <Link to='/buy-cover/family-loan' className="individual-btn mt-14 mb-14 ">Get Started</Link>
                        ) : type == 'lagos' ? (
                            <Link to='/buy-cover/lagos/family' className="individual-btn mt-14 mb-14">Get Started</Link>
                        ): type == 'oyo' ? (
                            <Link to='/buy-cover/oyo/family' className="individual-btn mt-14 mb-14">Get Started</Link>
                        ) : (
                            <Link to='/buy-cover/family' className="individual-btn mt-14 mb-14">Get Started</Link>
                        )}
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-around lg:gap-20 gap-10 lg:px-80 px-8 mb-14">
                    <div className="w-full">
                        <div className="w-full h-48  rounded-3xl overflow-hidden">
                            <img loading="lazy" src={buycover3} alt="buycover"  className="inline-block h-full w-full object-cover" />
                        </div>
                        <p className="mt-6 text-black font-bold text-2xl mb-6">SMEs</p>
                        <p className="text-black buycover-cap font-medium mb-6">Only Healthy employees bring their A game daily, . Invest in your employees health at very affordable prices.</p>
                        {type == 'loan' ? (
                            <Link to='/buy-cover/sme-loan' className="individual-btn mt-14 mb-14 ">Get Started</Link>
                        ) : type == 'lagos' ? (
                            <Link to='/buy-cover/lagos/sme' className="individual-btn mt-14 mb-14">Get Started</Link>
                        ): type == 'oyo' ? (
                            <Link to='/buy-cover/oyo/sme' className="individual-btn mt-14 mb-14">Get Started</Link>
                        ) : (
                            <Link to='/buy-cover/sme' className="individual-btn mt-14 mb-14">Get Started</Link>
                        )}
                    </div>
                    <div className="w-full">
                        <div className="w-full h-48  rounded-3xl overflow-hidden">
                            <img loading="lazy" src={buycover4} alt="buycover"  className="inline-block h-full w-full object-cover" />
                        </div>
                        <p className="mt-6 text-black font-bold text-2xl mb-6">Elderly</p>
                        <p className="text-black buycover-cap font-medium mb-6">Every elderly person (60Years and above) deserves to age well. Get a plan that covers chronic ailments like diabetes, hypertension and other chronic ailments.</p>
                        {type == 'loan' ? (
                            <Link to='/buy-cover/elderly-loan' className="individual-btn mt-14 mb-14 ">Get Started</Link>
                        ) : type == 'lagos' ? (
                            <Link to='/buy-cover/lagos/elderly' className="individual-btn mt-14 mb-14">Get Started</Link>
                        ): type == 'oyo' ? (
                            <Link to='/buy-cover/oyo/elderly' className="individual-btn mt-14 mb-14">Get Started</Link>
                        ) : (
                            <Link to='/buy-cover/elderly' className="individual-btn mt-14 mb-14">Get Started</Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-center lg:mt-56 mt-24">
                <div className="header text-center mb-8">
                    <p className="font-bold text-2xl mb-6">Government health <br /> Insurance Packages</p>
                </div>
                <div className="flex flex-col lg:flex-row justify-around lg:gap-x-20 gap-x-4 lg:px-80 px-8 lg:mb-44 mb-24">
                    <div className="p-2 lg:p-14 xl:p-5">
                        <img loading="lazy" src={lshs} alt="buycover" className="inline-block w-40" />
                        <p className="mt-6 text-black font-bold text-2xl mb-6">Are you a residence of Lagos state?</p>
                        <p className="text-black buycover-cap font-medium mb-6">The Lagos state health management agency have specially tailored health plans for all residents at affordable prices.</p>
                        <Link to="/buy-cover/lagos/individual" className="individual-btn mt-14 mb-14 ">Get Started</Link>
                    </div>
                    <div className="p-2 lg:p-14 xl:p-5">
                        <img loading="lazy" src={oyo} alt="buycover" className="inline-block w-36"  />
                        <p className="mt-6 text-black font-bold text-2xl mb-6">Are you a residence in Oyo state?</p>
                        <p className="text-black buycover-cap font-medium mb-6">The Oyo state health  insurance agency have specially tailored health plans for all residents of Oyo state at affordable prices. </p>
                        <Link to="/buy-cover/oyo/individual" className="individual-btn mt-14 mb-14 ">Get Started</Link>
                    </div>
                </div>
            </div>
            <Ready></Ready>
        </div>
    )
}

export default BuyCover
