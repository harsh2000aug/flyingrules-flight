import React from "react";
import { Link } from "react-router-dom";
import CallGif from "../../assets/images/new/call-image.gif"
import CountrySelector from "../countrySeloctor/CountrySelector"
import allcard from "../../assets/images/flight/card-home.webp"

import "./Footer.styles.css";

const Footer = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <footer className="tb-pad footer-bg">
      <div className="container">
        <div className="flex space-bw footer-menu-top">
          <div class="col-33 footer-menu">
            <h3>Company</h3>
            <ul>
              <li><a href={`${window.location.origin}/our-details`}>About Us</a></li>
              <li><a href={`${window.location.origin}/connect-us`}>Contact Us</a>
              </li>
            </ul>
          </div>
          <div class="col-33 footer-menu">
            <h3>Legal</h3>
            <ul>
              <li><a href={`${window.location.origin}/our-privacy-policy`}>Privacy Policy</a></li>
              <li><a href={`${window.location.origin}/our-terms-conditions`}>Terms and Condition</a></li>
              <li><a href={`${window.location.origin}/website-disclaimer`}>Disclaimer</a></li>
              <li><a href={`${window.location.origin}/refund-and-cancellation-policy`}>Refund and Cancellation</a></li>
            </ul>
          </div>
          <div className="col-33 footer-menu">
            <h3>Social Links</h3>
            <ul>
              <li>
                <a href="https://www.facebook.com/flyingrule">Facebook</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/flying-rules/">Linkedin</a>
              </li>
              <li>
                <CountrySelector />
              </li>
            </ul>
          </div>
        </div >
      </div >
    </footer >
  );
};

export default Footer;
