import React from 'react';
import { Link } from 'react-router-dom';
import footerLogo from '../../assets/img/footer-logo.svg'
import './footer.css'

function Footer() {
    return (
        <div className="px-40 footer font-primary">
            <div className="flex justify-between footer-map pb-20">
                <div className="flex-1">
                    <img src={footerLogo} alt="footer-logo" />

                    <p className="text-color font-medium text-xs mt-10">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris elementum sit aliquet gravida rhoncus gravida. Volutpat consectetur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris elementum sit aliquet gravida rhoncus gravida. Volutpat consectetur</p>
                </div>

                <div className="flex-1 mt-12">
                    <p className="pl-24 text-xl text-black mb-9 font-bold">Company</p>
                    <ul className="pl-24">
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/business-unit">Business Unit</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/portal">Portal</Link></li>
                    </ul>
                </div>

                <div className="flex-1 mt-12">
                    <p className="pl-8 text-xl text-black mb-9 font-bold">Support</p>
                    <ul className=" pl-8">
                        <li><Link to="/about">FAQs</Link></li>
                        <li><Link to="/about">Privacy Policy</Link></li>
                        <li><Link to="/about">Terms & Conditions</Link></li>
                        <li><Link to="/about">Community</Link></li>
                        <li><Link to="/about">Contact Us</Link></li>
                    </ul>
                </div>

                <div className="flex-1 mt-12">
                    <p className="text-xl text-black mb-9 font-bold">Address</p>
                    <ul>
                        <li>Location: 27 Lorem ipsum dolor sit amet, consectetur adipiscing</li>
                        <li><Link to="/about">Email: email@nucleusIS.io</Link></li>
                        <li><Link to="/about">Phone: + (xxx) xxx xxx</Link></li>
                        <li><Link to="/about">Fax: +x-xxx-xxxxxxx</Link></li>
                    </ul>
                </div>
            </div>
            <div className="text-center mb-4">
                <p className="copyright">Copyright @2021 <span>NucleusIS</span>. All rights reserved</p>
            </div>
        </div>
    )
}

export default Footer
