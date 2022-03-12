import React from 'react';
import { Link } from 'react-router-dom';
import oyo from '../../assets/img/oyo-agency.png'

function OyoAgency() {
    return (
        <div className="oyo-agency lg:pt-16 pt-8 lg:px-40 px-8 lg:pb-24 pb-8 flex lg:flex-row flex-col justify-between  gap-x-32">
            <div className="w-full">
                <img src={oyo} alt="Oyo Insurance Agency" />
            </div>
            <div className="w-full">
                <p className="font-extrabold text-3xl text-black mb-14">Are you a resident <br /> of Oyo state<br /> state?</p>
                <p className="font-medium text-sm text-black mb-7">The Oyo state health  insurance agency have specially tailored health plans for all residents of Oyo state at affordable prices. </p>
                <Link to='/buy-cover/oyo/individual' className="new-button2 rounded-xl text-sm inline-block">Get Started</Link>
            </div>
        </div>
    )
}

export default OyoAgency
