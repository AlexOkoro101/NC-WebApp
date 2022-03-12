import React from 'react';
import { Link } from 'react-router-dom';
import lshs from '../../assets/img/lshs.png';

function InsurancePackage() {
    return (
        <div className="p-8 lg:p-40 font-primary">
            <div className="text-center mb-8">
                <p className="font-bold text-2xl mb-14">Government health <br /> Insurance Packages</p>
            </div>

            <div className="flex justify-between lg:gap-x-32 gap-x-0 lg:flex-row flex-col">
                <div className="w-full">
                    <p className="font-extrabold text-3xl text-black mb-14">Are you a <br /> resident of Lagos <br /> state?</p>
                    <p className="font-medium text-sm text-black mb-7">The Lagos state health management agency have specially tailored health plans for all residents at affordable prices.</p>
                    <Link to='/buy-cover/lagos/individual'  className="new-button2 rounded-xl text-sm inline-block">Get Started</Link>
                </div>
                <div className="w-full">
                    <img src={lshs} alt="lshs" />
                </div>
            </div>
        </div>
    )
}

export default InsurancePackage
