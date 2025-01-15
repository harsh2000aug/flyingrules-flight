import React, { useEffect, useState } from "react";
import moment from "moment";

// import CtaType1 from "../../components/cta/CtaType1.component";
import CtaPopup from "../../components/cta-popup/CtaPopup.component";
import FlightResultItem from "../../components/flight-result-item/FlightResultItem.component";
import CarriersFilter from "../../components/carriers-filter/CarriersFilter.component";
import StopsFilter from "../../components/stops-filter/StopsFilter.component";
import { useNavigate } from "react-router-dom";
import { phoneNum } from "../../utils/globalVars";
import BannerSearchForm from "../../components/flight-search-form/BannerSearchForm.component";
import axios from "axios";
import SwiperResult from "../../components/swiper-result/SwiperResult";
import AirportFilter from "../../components/airport-filter/AirportFilter";
import HourFiltter from "../../components/time-filter/HourFiltter";
import AircraftFilter from "../../components/aircraft-filter/AircraftFilter"
import FlLoader from "../../components/fl-loader/FlLoader.component";
import FilterCard from "./Components/FilterCard";
import { useAtom } from "jotai";
import { airCraftListGlobal, airpostFilterGlobal, formOpenToggle, globalAirLineMultiSearch, globalAirlineSearch, globalStopSearch } from "../../jotai";
import TimeFilter from "../../components/time-slider-filter/TimeFilter";
import { getDuration } from "../../utils/utilFn";
import dayjs from "dayjs";

const FlightResultContainer = ({ dataToSend, flData, travObj, search, dickLength }) => {
  const [data, setData] = React.useState(null);
  const [sectorWiseData, setSectorWiseData] = React.useState([]);
  const [airlieData, setairlieData] = useState([]);
  const [selectedAirport, setSelectedAirport] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedHour, setSelectedHours] = React.useState("");
  const [airLineFilter] = useAtom(globalAirlineSearch);
  const [airLineListSearch] = useAtom(globalAirLineMultiSearch);
  const [stopSearchValue] = useAtom(globalStopSearch);
  const [globalFormFlag] = useAtom(formOpenToggle);
  const [airCraftList] = useAtom(airCraftListGlobal);
  const [airPortList] = useAtom(airpostFilterGlobal);
  const [topFilter, setTopFilter] = useState("Cheapest");
  const [topFilterFirstData, setTopFilterFirstData] = useState({});

  useEffect(() => {
    let currentCurrencyCode = sessionStorage.getItem("countryCode");
    if (currentCurrencyCode) {
      let newUrl = window.location.href.replace(/(currencyCode=)[A-Z]{3}/, `currencyCode=${currentCurrencyCode}`);
      window.history.replaceState(null, '', newUrl);
    }
  }, [sessionStorage.getItem("countryCode")]);

  function convertToMinutes(timeStr) {
    const regex = /(\d+)H\s*(\d+)M/;
    const match = timeStr.match(regex);

    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      return (hours * 60) + minutes;
    }
  }

  const navigate = useNavigate();
  const [filters, setFilters] = React.useState({
    stops: dataToSend.filters.stopsFilter,
    start: "",
    end: "",
    carriers: !!dataToSend.filters.carrierFilter
      ? dataToSend.filters.carrierFilter.split(",")
      : [],
  });

  // React.useEffect(() => {
  //   axios
  //     .get("https://cmi.Flyingrules.com/api/getruledata")
  //     .then((response) => {
  //       setairlieData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error("API Error:", error);
  //     });
  // }, []);

  React.useEffect(() => {
    if (airlieData.length > 0) {
      // console.log("Airlines", airlieData);
      const dataToSearch =
        dataToSend.locationDeparture + dataToSend.locationArrival;
      const filterSectorData = airlieData.filter(
        (el) => el.origin + el.destination === dataToSearch
      );
      // console.log("Data To Search", filterSectorData);
      setSectorWiseData(filterSectorData);
    }
  }, [airlieData]);


  let finalList;
  const loadflights = () => {
    function dateCheck(from, to, check) {
      var fDate, lDate, cDate;
      fDate = Date.parse(from);
      lDate = Date.parse(to);
      cDate = Date.parse(check);

      if (cDate <= lDate && cDate >= fDate) {
        return true;
      }
      return false;
    }
    finalList = flData.data.data;
    if (airLineListSearch.length > 0) {
      finalList = finalList.filter(itm => airLineListSearch.includes(itm.validatingAirlineCodes[0]))
    }

    if (stopSearchValue.length > 0) {
      finalList = finalList.filter(itm => stopSearchValue.includes(itm?.itineraries?.[0]?.segments?.length - 1))
    }

    if (airCraftList.length > 0) {
      finalList = finalList.filter(itm => airCraftList.includes(itm?.itineraries?.[0]?.segments?.[0]?.aircraft?.code))
    }

    if (airPortList.length > 0) {
      finalList = finalList.filter(itm => airPortList.includes(itm?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode))
    }

    if (topFilter === "Cheapest") {
      finalList = finalList.sort((a, b) => a?.price?.total - b?.price?.total)
    } else if (topFilter === "Best") {
      finalList = finalList.sort((a, b) => b?.price?.total - a?.price?.total)
    } else if (topFilter === "Quickest") {
      finalList = finalList.sort((a, b) => convertToMinutes(a?.itineraries?.[0]?.duration) - convertToMinutes(b?.itineraries?.[0]?.duration))
    }

    if (finalList.length === 0) {
      return (
        <div className="no-flights">
          <h3>No flights available for this route.</h3>
        </div>
      )
    }

    return finalList.map((el) => {
      const airlineName =
        flData.data.dictionaries.carriers[el.validatingAirlineCodes[0]];
      let flightPrice = {};
      const carriesrObj = flData.data.dictionaries.carriers;

      for (let key in carriesrObj) {
        const dataToSearch =
          dataToSend.locationDeparture + dataToSend.locationArrival;

        let filteredData = sectorWiseData.filter(
          (el) =>
            el.airline.toLowerCase() === key.toLowerCase() &&
            el.origin + el.destination === dataToSearch
        );

        let dateChecks = filteredData.filter((el) =>
          dateCheck(el.bookingFromDate, el.BookingToDate, dataToSend.departure)
        );
        let passeger = filteredData.filter(
          (el) => el.paxnoTo >= dataToSend.travellers.length
        );

        if (dateChecks.length > 0) {
          filteredData = dateChecks.filter(
            (el) =>
              el.airline.toLowerCase() === key.toLowerCase() &&
              el.origin + el.destination === dataToSearch &&
              dateCheck(
                el.bookingFromDate,
                el.BookingToDate,
                dataToSend.departure
              )
          );
        }

        if (dateChecks.length > 0 && passeger.length > 0) {
          filteredData = passeger.filter(
            (el) =>
              el.airline.toLowerCase() === key.toLowerCase() &&
              el.origin + el.destination === dataToSearch &&
              el.paxnoTo >= dataToSend.travellers.length
          );
        }

        flightPrice[key] = {
          amount: filteredData.length > 0 ? filteredData[0].amount : null,
          bookingFromDate:
            filteredData.length > 0 ? filteredData[0].bookingFromDate : null,
          BookingToDate:
            filteredData.length > 0 ? filteredData[0].BookingToDate : null,
          amountType:
            filteredData.length > 0 ? filteredData[0].amountType : null,
          calculateOn:
            filteredData.length > 0 ? filteredData[0].calculateOn : null,
        };
      }

      return (
        <>
          {airlineName?.toLowerCase()?.includes(airLineFilter?.toLowerCase()) &&
            <FlightResultItem
              flData={el}
              key={el.id}
              airlineName={airlineName}
              airportNames={flData.data.airportNames}
              allAirlineNames={flData.data.dictionaries.carriers}
              navigate={navigate}
              flightPrice={flightPrice}
              search={search}
              dickLength={dickLength}
            />

          }
        </>
      );
    });
  };

  useEffect(() => {
    if (finalList) {
      setTopFilterFirstData([
        finalList.sort((a, b) => a?.price?.total - b?.price?.total)?.[0],
        finalList.sort((a, b) => b?.price?.total - a?.price?.total)?.[0],
        finalList.sort((a, b) => convertToMinutes(a?.itineraries?.[0]?.duration) - convertToMinutes(b?.itineraries?.[0]?.duration))?.[0]
      ])
    }

  }, [finalList])
  const handleStopChange = (val) => {
    handleFilters({
      ...filters,
      stops: filters.stops !== val ? val : null,
    });

    setFilters({
      ...filters,
      stops: filters.stops !== val ? val : null,
    });
  };

  // timefitler
  const handleFlightTime = (val) => {
    console.log("filer DATa time", val.start.hours + ":" + val.start.minutes);

    handleFilters({
      ...filters,
      start: val.start.hours + ":" + val.start.minutes,
      end: val.end.hours + ":" + val.end.minutes,
    });

    setFilters({
      ...filters,
      start: val.start.hours + ":" + val.start.minutes,
      end: val.end.hours + ":" + val.end.minutes,
    });
  };

  const handleCarrierChange = (val) => {
    const isPresent = filters.carriers.includes(val);
    let newCarrArr = [];
    if (isPresent) {
      newCarrArr = filters.carriers.filter((el) => el !== val);
    } else {
      newCarrArr = [...filters.carriers, val];
    }

    handleFilters({
      ...filters,
      carriers: newCarrArr,
    });

    setFilters({
      ...filters,
      carriers: newCarrArr,
    });
  };


  ///Hours Filters
  const handleOptionSelect = (selectedValue) => {
    if (selectedValue != "0") {
      setSelectedHours(selectedValue);
      setIsLoading(true);
      flData.data.data = flData.data.data.filter(
        (x) =>
          x.itineraries[0].duration
            .split("PT")[1]
            .substring(
              0,
              x.itineraries[0].duration.split("PT")[1].length - 4
            ) == selectedValue
      );

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      return flData.data.data;
    }
  };

  //AirportFiltter
  const handleAirportChange = (value) => {
    const iataCode = value;
    if (value) {
      setSelectedAirport(iataCode);
      setIsLoading(true);
      flData.data.data = flData.data.data.filter(
        (x) => x.itineraries[0].segments[0].departure.iataCode == value
      );
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setSelectedAirport("");
      return flData.data.data;
    }
  };

  // Total flights filter

  const handleFilters = (filters) => {
    const filterString = `${!!filters.stops ? `&stopsFil=${filters.stops}` : ""
      }${filters.carriers.length > 0 ? `&carFil=${filters.carriers.join()}` : ""
      }${filters.start !== "" ? `&start=${filters.start}` : ""}${filters.end !== "" ? `&end=${filters.end}` : ""
      }`;

    navigate({
      pathname: "/flights",
      search: `?currencyCode=${sessionStorage.getItem("countryCode")}&search_t=${moment().unix()}&tripType=${dataToSend.tripType
        }&dep_loc=${dataToSend.locationDeparture}&dest_loc=${dataToSend.locationArrival
        }&dep_dt=${dataToSend.departure}&ret_dt=${dataToSend.arrival}&fl_cl=${dataToSend.flightClass
        }&adt=${travObj.adults}&chd=${travObj.child}${filterString}`,
    });

    console.log("filterString", filterString);
  };

  ///In mobile Open filtter Modal
  const [activeModalId, setActiveModalId] = React.useState(null);

  const handleModalOpen = (modalId) => {
    setActiveModalId(modalId);
  };

  const handleModalClose = () => {
    setActiveModalId(null);
  };


  const Modal = ({ isOpen, onClose, modalId }) => {
    return (
      isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={() => onClose(modalId)}>
              <i className="fa-solid fa-circle-xmark"></i>
            </span>
            <div>
              {modalId == 1 ? (
                <StopsFilter onClose={onClose} modalId={modalId} />
              ) : (
                ""
              )}
              {modalId == 2 ? (
                <CarriersFilter
                  data={flData.data.dictionaries.carriers}
                  onClose={onClose}
                  modalId={modalId}
                />
              ) : (
                ""
              )}

              {/* {modalId == 3 ? (
                <HourFiltter
                  data={flData.data.data}
                  onSelect={handleOptionSelect}
                />
              ) : (
                ""
              )} */}
              {modalId == 4 ? (
                <AirportFilter
                  data={flData.data}
                  onClose={onClose}
                  modalId={modalId}
                />
              ) : (
                ""
              )}
              {modalId == 5 ? (
                <AircraftFilter
                  data={flData.data.dictionaries.aircraft}
                  onClose={onClose}
                  modalId={modalId}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )
    );
  };

  // Form Modal

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [isOpenModal, setOpenModal] = React.useState(false); // Define your breakpoint for mobile

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleFormModalOpen = () => {
    setOpenModal(true);
  };
  const handleFormModalClose = () => {
    setOpenModal(false);
  };

  const FormModal = ({ isOpen, onClose }) => {
    return (
      isOpen && (
        <div className="form-modal-overlay">
          <div className="form-modal-content">
            <span className="close-bttn" onClick={onClose}>
              &times;
            </span>
            <div>
              <BannerSearchForm depVal={data} urlVal={dataToSend} />
            </div>
          </div>
        </div>
      )
    );
  };
  const [scrollBarClass, setScrollBarClass] = useState("");
  useEffect(() => {
    if (window.innerWidth >= 500) {
      setScrollBarClass("sidebar-desktop");
    } else {
      setScrollBarClass("");
    }
  }, [window.innerWidth])
  return (
    <React.Fragment>
      {!isLoading ? (
        <div className="cm-flight-result-container ticket_booking">
          {!!isMobile ? (
            <div>
              <div className="header-block-modal">
                <FormModal
                  isOpen={isOpenModal}
                  onClose={handleFormModalClose}
                />
                <ul className="modal-list" onClick={handleFormModalOpen}>
                  <li className="modal-text">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{dataToSend.locationDeparture}</span>
                    <i className="fa-solid fa-arrow-right-long"></i>
                    <span>{dataToSend.locationArrival}</span>
                  </li>
                  <li className="modal-text">
                    <i className="fa-solid fa-user"></i> {travObj.adults}
                  </li>
                  <li className="modal-text">Coach</li>
                  <li className="modal-text ">
                    <span className="edit">Edit</span>
                  </li>
                  <li className="modal-text">
                    <a className="icon-mweb is--bell-icon is--bell-animate  is--bell-shake"></a>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* {
                globalFormFlag && */}
              <BannerSearchForm depVal={data} urlVal={dataToSend} />
              {/* } */}
            </>
          )}
          {flData.data.data.length > 0 ? (
            <React.Fragment>
              {/* <CtaType1 fareToShow={flData.data.data[0].price.base} /> */}

              <div className="new-cm-section cm-flight-result-wrapper">
                <div className="cm-page-center cm-flex cm-flex-align-fs">
                  <div className="cm-filter-sidebar">
                    <div className={`inner-sidebar ${scrollBarClass}`}>
                      <div className="sidebar-wrapper">
                        <div className="cm-filter-widget">
                          <h4>Total Fligts</h4>
                          <p><b>{flData.data.data.length}</b> Flights Found</p>
                        </div>
                        <StopsFilter
                          selected={filters.stops}
                          handleStopChange={handleStopChange}
                        />
                        <CarriersFilter
                          selected={filters.carriers}
                          handleCarrierChange={handleCarrierChange}
                          data={flData.data.dictionaries.carriers}
                        />
                        {/* <HourFiltter
                          data={flData.data.data}
                          onSelect={handleOptionSelect}
                        /> */}

                        <AirportFilter
                          selected={selectedAirport}
                          // selected={filters.airportNames}
                          // handleAirpotChange={handleAirpotChange}
                          onInputChange={handleAirportChange}
                          data={flData.data}
                        />

                        <AircraftFilter data={flData.data.dictionaries.aircraft} />

                        {/* <TimeFilter
                          start={filters.start}
                          end={filters.end}
                          handleFlightTime={handleFlightTime}
                          destination={dataToSend}
                        /> */}

                      </div>
                      <div className="mobile-tabs">
                        <div className="tabs-header">
                          <p>Filter By:</p>
                          <button onClick={() => handleModalOpen(1)}>
                            Stops
                          </button>
                          <button onClick={() => handleModalOpen(2)}>
                            Airlines
                          </button>
                          {/* <button onClick={() => handleModalOpen(3)}>
                            Hour
                          </button> */}
                          <button onClick={() => handleModalOpen(4)}>
                            Airports
                          </button>
                          <button onClick={() => handleModalOpen(5)}>
                            Aircraft
                          </button>
                          <Modal
                            isOpen={activeModalId === 1}
                            onClose={handleModalClose}
                            modalId={1}
                          />
                          <Modal
                            isOpen={activeModalId === 2}
                            onClose={handleModalClose}
                            modalId={2}
                          />
                          {/* <Modal
                            isOpen={activeModalId === 3}
                            onClose={handleModalClose}
                            modalId={3}
                          /> */}
                          <Modal
                            isOpen={activeModalId === 4}
                            onClose={handleModalClose}
                            modalId={4}
                          />
                          <Modal
                            isOpen={activeModalId === 5}
                            onClose={handleModalClose}
                            modalId={5}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="social-media-add">
                      <a
                        href="https://www.facebook.com/trainfly"
                        target="_blank"
                      >
                        <img
                          src={require("../../assets/images/flight/add-fb.jpg")}
                          alt=""
                        />
                      </a>
                      <a href="https://twitter.com/trainfly" target="_blank">
                        <img
                          src={require("../../assets/images/flight/add-twiter.png")}
                          alt=""
                        />
                      </a>
                    </div> */}
                  </div>
                  <div className="cm-result-wrap cm-lr-pad">
                    <FilterCard topFilter={topFilter} setTopFilter={setTopFilter} topFilterFirstData={topFilterFirstData} />
                    <SwiperResult
                      selected={filters.stops}
                      handleStopChange={handleStopChange}
                      data={flData.data.dictionaries.carriers}
                      allData={flData.data}
                      dictionaries={flData.data.dictionaries}
                    />
                    {loadflights()}
                  </div>
                  <div className="adds-area">
                    <div>
                      <a href={`tel:+18008631892`}>
                        <img
                          src={require("../../assets/images/flight/add.png")}
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="cm-booking-cta cm-txt-center add-col">
                      <h4>Need Help?</h4>
                      <div className="cm-content">
                        <p>
                          Our travel experts are just a call away! Get in touch now to
                          customize your vacation hassle-free and enjoy your time
                          away!
                        </p>
                        <h5>Call Us</h5>
                        <a className="cm-prim-col" href={`tel: ${phoneNum.value}`}>
                          {phoneNum.label}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CtaPopup dataToSend={dataToSend} />
            </React.Fragment>
          ) : (
            <div className="cm-empty-fl-container cm-section cm-txt-center">
              <p className="cm-empty-msg">No flights available.</p>
              <a href={window.location.origin} style={{ color: "#000" }} className="cm-btn cm-sec-bg2 cm-white-col">
                Go Back
              </a>
            </div>
          )}
        </div>
      ) : (
        <FlLoader data={dataToSend} />
      )}
    </React.Fragment>
  );
};

export default FlightResultContainer;
