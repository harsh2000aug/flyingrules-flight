import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./Header.styles.css";
import logo from "../../assets/images/new/logo.png";
import CountrySelector from "../countrySeloctor/CountrySelector";
import $ from 'jquery';
import { useAtom } from "jotai";
import { formOpenToggle } from "../../jotai";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import handleChangeCurrency from "../../redux/currency/currency.action";

const Header = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currencyCode = searchParams.get("currencyCode");
  const dispatch = useDispatch();

  useEffect(() => {
    if (currencyCode) {
      dispatch(handleChangeCurrency(currencyCode));
    }
  }, [currencyCode])

  $(document).on('click', "#bars", function () {
    $(".side-menu").show();
  });
  $(document).on('click', '#close', function () {
    $('.side-menu').hide();
  });

  return (
    <header>
      <div className="container">
        <nav>
          <div className="flex space-bw al-center">
            <div className="logo">
              <a href={window.location.origin}>
                <img src={logo} alt="" />
              </a>
            </div>
            <div className="menu">
              <ul className="main-menu">
                <li>
                  <a href="">Cancellation Policy</a>
                  <i className="fa-solid fa-chevron-down" id="cancellationPolicy"></i>
                  <ul className="submenu">
                    <li>
                      <a href="">
                        United Airline Cancellation Policy
                      </a>
                    </li>
                    <li>
                      <a href="">
                        United Airline Cancellation Policy
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="">Flight Change</a>
                  <i className="fa-solid fa-chevron-down"></i>
                </li>
                <li>
                  <a href="">Name Change</a>
                  <i className="fa-solid fa-chevron-down"></i>
                </li>
                <li>
                  <a href="">Reservation Policy</a>
                  <i className="fa-solid fa-chevron-down"></i>
                </li>
                <li>
                  <a href="">Blog</a>
                </li>
              </ul>
            </div>
            <div className="call-btn">
              <a href="tel:+18008631892">+1-800-863-1892</a>
              {/* <CountrySelector currencyCode={currencyCode} /> */}
            </div>
            <div className="toggle">
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
