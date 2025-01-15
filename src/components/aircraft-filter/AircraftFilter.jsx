import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { airCraftListGlobal } from "../../jotai";

// , selected, handleCarrierChange
const AircraftFilter = ({ data, onClose, modalId }) => {
    const [airlineList, setAirLineList] = useAtom(airCraftListGlobal);

    const handleInpChange = (e) => {
        if (e.target.checked) {
            setAirLineList(oldValue => {
                return [...oldValue, e.target.value]
            });
        } else {
            setAirLineList(oldValue => {
                return oldValue.filter(itm => itm !== e.target.value)
            })
        }
        // onClose(modalId);
    };

    const loadCarriers = () => {
        const carrierArr = [];
        for (let key in data) {
            carrierArr.push(
                <li key={key}>
                    <label htmlFor={key}>
                        <input
                            onChange={handleInpChange}
                            type="checkbox"
                            name="stops"
                            value={key}
                            id={key}
                            checked={airlineList.includes(key)}
                        />
                        <span>{data[key]}</span>
                    </label>
                </li>
            );
        }

        return carrierArr;
    };

    return (
        <div className="cm-filter-widget cm-carrier-filter">
            <h4>Aircraft</h4>
            <ul className="cm-menu-ul">{loadCarriers()}</ul>
        </div>
    );
};

export default AircraftFilter;
