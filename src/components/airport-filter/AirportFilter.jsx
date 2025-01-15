import { useAtom } from "jotai";
import React, { useState } from "react";
import { airpostFilterGlobal } from "../../jotai";

const AirportFilter = ({ data, onClose, modalId }) => {
    const [showAll, setShowAll] = useState(false);
    const [airportFilter, setAirportFilter] = useAtom(airpostFilterGlobal);

    const handleInpChange = (e) => {
        if (e.target.checked) {
            setAirportFilter(oldValue => {
                return [...oldValue, e.target.value]
            });
        } else {
            setAirportFilter(oldValue => {
                return oldValue.filter(itm => itm !== e.target.value)
            })
        }
        // onClose(modalId);
    };

    console.log(data.airportNames, "airportnames")
    const loadAirport = () => {
        const airportData = data.airportNames;
        const airports = [];
        let count = 0;
        for (let key in airportData) {
            if (!showAll && count >= 5) {
                break; // Limit the display to 5 items if showAll is false
            }
            airports.push(
                airportData[key] == undefined ? (
                    ""
                ) : (
                    <li key={key}>
                        <label htmlFor={key}>
                            <input
                                onChange={handleInpChange}
                                type="checkbox"
                                name="airport"
                                value={key}
                                id={key}
                                checked={airportFilter.includes(key)} // Set checked attribute based on selected prop
                            />
                            {airportData[key] == undefined ? (
                                ""
                            ) : (
                                <span>{airportData[key].name}</span>
                            )}
                        </label>
                    </li>
                )
            );
            count++;
        }

        return airports;
    };


    const handleShowAll = () => {
        setShowAll(true);
    };

    const handleHide = () => {
        setShowAll(false);
    };

    return (
        <div className="cm-filter-widget cm-carrier-filter">
            <h4>Airport</h4>
            <ul className="cm-menu-ul">{loadAirport()}</ul>
            {Object.keys(data.airportNames).length > 5 && !showAll && (
                <div
                    style={{
                        paddingTop: "10px",
                        textAlign: "right",
                        cursor: "pointer",
                    }}
                >
                    <span onClick={handleShowAll} style={{ fontSize: "14px" }}>
                        Show more&nbsp;<i className="fa-solid fa-chevron-down"></i>
                    </span>
                </div>
            )}
            {showAll && (
                <div
                    style={{
                        paddingTop: "10px",
                        textAlign: "right",
                        cursor: "pointer",
                    }}
                >
                    <span onClick={handleHide} style={{ fontSize: "14px" }}>
                        Hide&nbsp;<i className="fa-solid fa-chevron-up "></i>
                    </span>
                </div>
            )}
        </div>
    );
};

export default AirportFilter;
