import axios from "axios";
import React, { useEffect, useState } from "react";
import airports from "../../assets/data/airports.json";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { saveFlData } from "../../redux/save-fl-data/flData.action";
import FlLoader from "../../components/fl-loader/FlLoader.component";
import FlightResultContainer from "../../containers/flight-result/FlightResult.container";
import { api_url } from "../../utils/apiInfo";
import { countryDeta } from "../../utils/cuntryname"
import "./FlightResult.styles.css";
import AboutPage from "../about-us/About.page";
import ContactPage from "../contact-us/Contact.page";
import PrivacyPolicyPage from "../legal/PrivacyPolicy.page";
import TncPage from "../legal/Tnc.page";
import DisclaimerPage from "../legal/Disclaimer.page";
import RefundPolicyPage from "../legal/RefundPolicy.page";
import BookTicketsPage from "../book-tickets/BookTickets.page";

const FlightResult = () => {
  const { search } = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const flightData = useSelector((state) => state.flData);
  const [dickLength, setDickLength] = useState([]);

  // console.log("Currency 1", currency);

  const [flDataToSend, setFlDataToSend] = React.useState(null);
  // page state
  const [aboutUs, setAboutus] = useState(false);
  const [contactus, setContactus] = useState(false);
  const [privacyPolicyState, setPrivacyPolicyState] = useState(false);
  const [termandCondition, setTermandCondition] = useState(false);
  const [disclaimer, setdisclaimer] = useState(false);
  const [randPPolicy, setrandPPolicy] = useState(false);
  const [BookTickets, setBookTicketsPage] = useState(false);

  // set page state


  // const [currencySel, setcurrencySel] = React.useState(currency);
  const [flData, setFlData] = React.useState({
    data: null,
    isLoading: true,
  });

  const currency = useSelector((state) => state.currency);

  useEffect(() => {
    if (search.includes("about")) {
      setAboutus(true);
    } else if (search.includes("contact-us")) {
      setContactus(true)
    } else if (search.includes("privacy-policy")) {
      setPrivacyPolicyState(true)
    } else if (search.includes("terms-and-conditions")) {
      setTermandCondition(true);
    } else if (search.includes("disclaimer")) {
      setdisclaimer(true);
    } else if (search.includes("refund-and-cancellation-policy")) {
      setrandPPolicy(true);
    }
    // else if (search.includes("booking")) {
    //   setBookTicketsPage(true);
    // }

  }, [search])

  const fetchFlights = async (dataToSend) => {
    setDickLength(dataToSend?.travellers);
    try {
      // console.log("data to send", dataToSend);
      setFlData({
        ...flData,
        data: null,
        isLoading: true,
      });

      const res = await axios.post(
        `${api_url}/flight/flight-offer`,
        dataToSend
      );

      // console.log("flight data", res.data);

      if (res.data.status === "success") {
        if (res.data.data.data.length > 0) {
          console.log("here");
          setFlData({
            data: {
              ...res.data.data,
              airportNames: getAirports(res.data.data.dictionaries.locations),
            },
            isLoading: false,
          });
        } else {
          setFlData({
            data: {
              ...res.data.data,
            },
            isLoading: false,
          });
        }
        // dispatch(
        //   saveFlData({
        //     ...res.data.data,
        //     airportNames: getAirports(res.data.data.dictionaries.locations),
        //   })
        // );
      }
    } catch (error) {
      console.log("Fetch Flight error", error);
    }
  };

  const getAirports = (airportLocations) => {
    console.log("airportLocations", airportLocations);

    const airportNames = {};
    for (let key in airportLocations) {
      airportNames[key] = airports.find((el) => el.code === key);
    }

    return airportNames;
  };


  React.useEffect(() => {
    window.scrollTo(0, 0);
    !!flDataToSend && fetchFlights(flDataToSend);
  }, [flDataToSend]);

  const generateTrav = (adults, child) => {
    if (adults === null || child === null) return null;

    let travArr = [];
    var travId = 0;

    for (let i = 0; i < adults; i++) {
      travId = parseInt(travId) + 1;
      travArr.push({
        id: travId.toString(),
        travelerType: "ADULT",
      });
    }

    if (child > 0) {
      for (let i = 0; i < child; i++) {
        travId = parseInt(travId) + 1;
        travArr.push({
          id: travId.toString(),
          travelerType: "CHILD",
        });
      }
    }

    return travArr;
  };
  let urlname = 'ca';


  React.useEffect(() => {
    const dataToSend = {
      search_time: new URLSearchParams(search).get("search_t"),
      tripType: new URLSearchParams(search).get("tripType"),
      locationDeparture: new URLSearchParams(search).get("dep_loc"),
      locationArrival: new URLSearchParams(search).get("dest_loc"),
      departure: new URLSearchParams(search).get("dep_dt"),
      arrival: new URLSearchParams(search).get("ret_dt"),
      flightClass: new URLSearchParams(search).get("fl_cl"),
      travellers: generateTrav(
        new URLSearchParams(search).get("adt"),
        new URLSearchParams(search).get("chd")
      ),
      filters: {
        carrierFilter: new URLSearchParams(search).get("carFil"),
        stopsFilter: new URLSearchParams(search).get("stopsFil"),
        maxFlightTime: 100,
        // end: new URLSearchParams(search).get("end"),
      },
    };

    // for (let key in dataToSend) {
    //   if (dataToSend[key] === null) {
    //     navigate("/", { replace: true });
    //   }
    // }

    setFlDataToSend({
      ...dataToSend,
      currency: currency
    });
  }, [search, currency]);
  return (
    aboutUs ? <AboutPage /> :
      contactus ? <ContactPage /> :
        privacyPolicyState ? <PrivacyPolicyPage /> :
          termandCondition ? <TncPage /> :
            disclaimer ? <DisclaimerPage /> :
              randPPolicy ? <RefundPolicyPage /> :
                BookTickets ? <BookTicketsPage /> :
                  !!flDataToSend ? (
                    !!flData.data ? (
                      <FlightResultContainer
                        flData={flData}
                        dataToSend={flDataToSend}
                        dickLength={dickLength}
                        travObj={{
                          adults: new URLSearchParams(search).get("adt"),
                          child: new URLSearchParams(search).get("chd"),
                        }}
                        search={search}
                      />
                    ) : (
                      <FlLoader data={flDataToSend} />
                    )
                  ) : null);
};

export default FlightResult;
