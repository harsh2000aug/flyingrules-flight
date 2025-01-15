import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookTicketsContainer from "../../containers/book-tickets/BookTickets.container";
import { api_url } from "../../utils/apiInfo";
import airports from "../../assets/data/airports.json";


import "./BookTickets.styles.css";
import { charges } from "../../utils/charges";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useAtom } from "jotai";
import { currentBooking } from "../../jotai";
const BookTicketsPage = () => {
  const [, setCurrentBooking] = useAtom(currentBooking)

  let navigate = useNavigate();
  const location = useLocation();

  const calcTaxes = (flData) => {
    let airlineTax = charges.airlineTaxes[flData.validatingAirlineCodes[0]];
    if (!airlineTax) {
      airlineTax = charges.airlineTaxes.OTHER;
    }
    return (parseFloat(flData?.price?.grandTotal) * (airlineTax / 100)).toFixed(2);
  };

  const getAirports = (airportLocations) => {
    const airportNames = {};
    for (let key in airportLocations) {
      airportNames[key] = airports.find((el) => el.code === key);
    }

    return airportNames;
  };

  const [data, setData] = React.useState(undefined);

  const { search } = location;

  const dataFetchFromUrl = async () => {
    const queryArray = search.substring(1).split("&");
    const jsonObject = queryArray.reduce((acc, pair) => {
      const [key, value] = pair.split("=");
      acc[key] = decodeURIComponent(value); // Decode URL-encoded characters
      return acc;
    }, {});

    const apiRequest = {
      "search_time": jsonObject.search_t,
      "tripType": jsonObject.tripType,
      "locationDeparture": jsonObject.dep_loc,
      "locationArrival": jsonObject.dest_loc,
      "departure": jsonObject.dep_dt,
      "arrival": jsonObject.ret_dt,
      "flightClass": jsonObject.fl_cl,
      "travellers": [
        {
          "id": jsonObject.adt,
          "travelerType": "ADULT"
        }
      ],
      "filters": {
        "carrierFilter": null,
        "stopsFilter": null,
        "maxFlightTime": 100
      },
      "currency": jsonObject.currencyCode
    };

    try {
      const res = await axios.post(
        `${api_url}/flight/flight-offer`,
        apiRequest
      );
      if (res.data.status === "success") {
        if (res.data.data.data.length > 0) {
          const currentPussy = res.data.data.data.find(obj => obj?.id === jsonObject?.obj_id);
          const newData = {
            flData: currentPussy,
            airlineName: res.data.data.dictionaries.carriers[currentPussy.validatingAirlineCodes[0]],
            allAirlineNames: res.data.data?.dictionaries?.carriers,
            flightTotal: currentPussy?.price?.grandTotal,
            grandTotal: (parseFloat(currentPussy?.price?.grandTotal) + parseFloat(calcTaxes(currentPussy))).toFixed(2),
            taxes: calcTaxes(currentPussy),
            airportNames: getAirports(res.data.data.dictionaries.locations)
          }
          setCurrentBooking(newData);
          setData(newData)
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  React.useEffect(() => {
    dataFetchFromUrl();
  }, [search])

  React.useEffect(() => {
    if (data === null) navigate("/");
  }, [data]);

  React.useEffect(() => {
    if (data !== null) fetchOfferPricing();
    window.scrollTo(0, 0);
  }, []);


  const fetchOfferPricing = async () => {
    try {
      const res = await axios.post(`${api_url}/flight/flight-pricing`, {
        flData: data.flData,
      });
      if (res.data.status === "success") {
        console.log("res.data.data.data", res.data.data.data.flightOffers[0]);
        setData({
          ...data,
          flData: res.data.data.data.flightOffers[0],
        });
      }
    } catch (error) {
      console.log("fetchOfferPricing error", error);
    }
  };

  return data !== undefined ? <BookTicketsContainer data={data} /> : <FullScreenLoader />;
};

export default BookTicketsPage;
