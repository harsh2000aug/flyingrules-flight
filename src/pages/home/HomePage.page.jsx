import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FlightSearchForm from "../../components/flight-search-form/FlightSearchForm.component";
import moment from "moment";
import "./Homepage.styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PopupPage from "../popup-deals/Popuppage";
import axios from "axios";
import { theme_airline_url } from "../../utils/apiInfo";
import BestTour from "../../components/BestTours/BestTour";
import BestTourAu from "../../components/BestTours/BestTourAu";
import BestTourCa from "../../components/BestTours/BestTourCa";
import BestTourIn from "../../components/BestTours/BestTourIn";
import BestTourNz from "../../components/BestTours/BestTourNz";
import BestTourPh from "../../components/BestTours/BestTourPh";
import BestTourQa from "../../components/BestTours/BestTourQa";
import BestTourRp from "../../components/BestTours/BestTourRp";
import BestTourSg from "../../components/BestTours/BestTourSg";
import BestTourUAE from "../../components/BestTours/BestTourUAE";
import BestTourHk from "../../components/BestTours/BestTourHk";
import BestTourMy from "../../components/BestTours/BestTourMy";
import BestTourZa from "../../components/BestTours/BestTourZa";
import BestTourTh from "../../components/BestTours/BestTourTh";
import BestTourUk from "../../components/BestTours/BestTourUk";
import BestTourVn from "../../components/BestTours/BestTourVn";
import maldives from "../../assets/images/new/maldives.png";
import rome from "../../assets/images/new/rome.png";
import callcenter from "../../assets/images/new/call-center.png";
import icon1 from "../../assets/images/new/pick-icon-1.png";
import icon2 from "../../assets/images/new/pick-icon-2.png";
import icon3 from "../../assets/images/new/pick-icon-3.png";
import pickup from "../../assets/images/new/pick-us.png";
import person1 from "../../assets/images/new/person1.jpg";
import person2 from "../../assets/images/new/person2.jpg";
import person3 from "../../assets/images/new/person3.jpg";
import person4 from "../../assets/images/new/person4.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [res, setRes] = useState();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExpClick = (origin, dest) => {
    navigate({
      pathname: "/flights",
      search: `?currencyCode=${sessionStorage.getItem("countryCode")}&search_t=${moment().unix()}&tripType=one-way&dep_loc=${origin}&dest_loc=${dest}&dep_dt=${moment().format(
        "YYYY-MM-DD"
      )}&ret_dt=null&fl_cl=ECONOMY&adt=1&chd=0`,
    });
  };


  const loadBestTour = () => {
    let urlname
    urlname = window.location.hostname.split('.')[0];
    if (urlname === 'localhost') {
      urlname = "en"
    } else {
      if (urlname === 'www') {
        urlname = "en"
      }
    }

    return (
      <>
        {urlname === 'Flyingrules' ? <BestTour /> : ""}
        {urlname === 'au' ? <BestTourAu /> : ""}
        {urlname === 'ca' ? <BestTourCa /> : ""}
        {urlname === 'hk' ? <BestTourHk /> : ""}
        {urlname === 'in' ? <BestTourIn /> : ""}
        {urlname === 'id' ? <BestTourRp /> : ""}
        {urlname === 'my' ? <BestTourMy /> : ""}
        {urlname === 'nz' ? <BestTourNz /> : ""}
        {urlname === 'ph' ? <BestTourPh /> : ""}
        {urlname === 'qa' ? <BestTourQa /> : ""}
        {urlname === 'sg' ? <BestTourSg /> : ""}
        {urlname === 'sa' ? <BestTourZa /> : ""}
        {urlname === 'th' ? <BestTourTh /> : ""}
        {urlname === 'en' ? <BestTour /> : ""}
        {urlname === 'es' ? <BestTour /> : ""}
        {urlname === 'ae' ? <BestTourUAE /> : ""}
        {urlname === 'uk' ? <BestTourUk /> : ""}
        {urlname === 'vn' ? <BestTourVn /> : ""}
      </>
    )
  }
  // const [showPopup, setPopup] = useState('active')

  // function removePopup(){
  //   setPopup('')
  // }

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
  };

  const urlFull = window.location.href;
  useEffect(() => {
    axios
      .get(`${theme_airline_url}`, {
        params: {
          url: urlFull,
        },
      })
      .then((response) => {
        setRes(response.data.status);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, [urlFull]);
  return (
    <React.Fragment>
      <Helmet>
        <title>Flyingrules | Home </title>
      </Helmet>
      {res === "1" ? <PopupPage /> : ""}

      <section className="header-section">
        <div className="flight-form">
          <div className="banner-top">
            <h3><i className="fa-solid fa-plane"></i> FLIGHTS</h3>
          </div>
          <div className="booking-form">
            <FlightSearchForm />
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container text-center">
          <h1>Call us 24/7 at <a href="tel:+18008631892">+1-800-863-1892</a> to get great deals!</h1>
        </div>
      </section>

      <section className="tb-pad">
        <div className="container">
          <div className="common-text">
            <h2><span>Popular Locations</span></h2>
          </div>
          <Slider {...settings} className="locations">
            <div className="location-slide">
              <img src={maldives} alt="" />
              <div className="text">
                <div className="text-center">
                  <h3>Maldives</h3>
                </div>
                <div className="price-list">
                  <p>$399</p>
                </div>
                <a href="">Plan trip now</a>
              </div>
            </div>
            <div className="location-slide">
              <img src={rome} alt="" />
              <div className="text">
                <div className="text-center">
                  <h3>Rome</h3>
                </div>
                <div className="price-list">
                  <p>$399</p>
                </div>
                <a href="">Plan trip now</a>
              </div>
            </div>
            <div className="location-slide">
              <img src={maldives} alt="" />
              <div className="text">
                <div className="text-center">
                  <h3>Maldives</h3>
                </div>
                <div className="price-list">
                  <p>$399</p>
                </div>
                <a href="">Plan trip now</a>
              </div>
            </div>
            <div className="location-slide">
              <img src={rome} alt="" />
              <div className="text">
                <div className="text-center">
                  <h3>Maldives</h3>
                </div>
                <div className="price-list">
                  <p>$399</p>
                </div>
                <a href="">Plan trip now</a>
              </div>
            </div>
          </Slider>
        </div>
      </section>

      <section className="tb-pad">
        <div className="container">
          <div className="common-text">
            <h2><span>Why to Book with Call Center?</span></h2>
          </div>
          <div className="flex space-bw">
            <div className="col-33 call-center text-center">
              <img src={callcenter} alt="" />
              <h3>Expert Guidance by Travel Experts</h3>
              <p>"Effortless ticket booking at your fingertips Streamlined and user-friendly, our platform ensures
                a hassle-free experience for all your event reservations."
              </p>
            </div>
            <div className="col-33 call-center text-center">
              <img src={callcenter} alt="" />
              <h3>Expert Guidance by Travel Experts</h3>
              <p>"Effortless ticket booking at your fingertips Streamlined and user-friendly, our platform ensures
                a hassle-free experience for all your event reservations."
              </p>
            </div>
            <div className="col-33 call-center text-center">
              <img src={callcenter} alt="" />
              <h3>Expert Guidance by Travel Experts</h3>
              <p>"Effortless ticket booking at your fingertips Streamlined and user-friendly, our platform ensures
                a hassle-free experience for all your event reservations."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="tb-pad">
        <div class="container">
          <div class="common-text">
            <h2><span>Why you pick us?</span></h2>
          </div>
          <div class="flex space-bw al-center">
            <div class="col-70">
              <div class="flex al-center pick-us-head">
                <div class="pick-us-img">
                  <img src={icon1} alt="" />
                </div>
                <div class="pick-us-text">
                  <h3>Easy Ticket Booking</h3>
                  <p>"Effortless ticket booking at your fingertips!
                    Streamlined and user-friendly,
                    our platform ensures a hassle-free experience
                    for all your event reservations."
                  </p>
                </div>
              </div>
              <div class="flex al-center pick-us-head">
                <div class="pick-us-img">
                  <img src={icon2} alt="" />
                </div>
                <div class="pick-us-text">
                  <h3>Best Tour Plan</h3>
                  <p>"Embark on the ultimate adventure with our
                    meticulously crafted tour plan, blending convenience
                    and excitement for an unforgettable travel experience.
                  </p>
                </div>
              </div>
              <div class="flex al-center pick-us-head">
                <div class="pick-us-img">
                  <img src={icon3} alt="" />
                </div>
                <div class="pick-us-text">
                  <h3>24/7 Customer Support</h3>
                  <p>Experience peace of mind with our 24/7 customer
                    support, ensuring assistance at any hour.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-30">
              <div class="pick-us-images">
                <img src={pickup} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="tb-pad">
        <div class="container">
          <div class="common-text">
            <h2><span>What our travelers say</span></h2>
          </div>
          <Slider {...settings} class="testimonials">
            <div class="testimonial-slide text-center">
              <img src={person1} alt="" />
              <h3>Robert James</h3>
              <div>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <p>"Exceptional travel website – seamless booking, diverse options, and outstanding customer support
                made my solo adventure unforgettable."</p>
            </div>
            <div class="testimonial-slide text-center">
              <img src={person2} alt="" />
              <h3>Anna Williams</h3>
              <div>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <p>"Exceptional travel website – seamless booking, diverse options, and outstanding customer support
                made my solo adventure unforgettable."</p>
            </div>
            <div class="testimonial-slide text-center">
              <img src={person3} alt="" />
              <h3>Anna Williams</h3>
              <div>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <p>"Exceptional travel website – seamless booking, diverse options, and outstanding customer support
                made my solo adventure unforgettable."</p>
            </div>
            <div class="testimonial-slide text-center">
              <img src={person4} alt="" />
              <h3>Anna Williams</h3>
              <div>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <p>"Exceptional travel website – seamless booking, diverse options, and outstanding customer support
                made my solo adventure unforgettable."</p>
            </div>
          </Slider>
        </div>
      </section>

    </React.Fragment >
  );
};

export default HomePage;
