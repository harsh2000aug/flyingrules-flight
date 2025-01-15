import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { globalStopSearch } from "../../jotai";


const StopsFilter = ({ onClose, modalId }) => {
  const [stopList, setStopValue] = useAtom(globalStopSearch);

  const handleInpChange = (e) => {
    if (e.target.checked) {
      setStopValue(oldValue => {
        return [...oldValue, Number(e.target.value)]
      });
    } else {
      setStopValue(oldValue => {
        return oldValue.filter(itm => itm !== Number(e.target.value))
      })
    }
    // onClose(modalId);
  };

  return (
    <div className="cm-filter-widget cm-stops-filter">
      <h4>Stops</h4>
      <ul className="cm-menu-ul">
        <li>
          <label htmlFor="non-stop">
            <input
              type="checkbox"
              onChange={handleInpChange}
              name="stops"
              value="0"
              id="non-stop"
              checked={stopList.includes(0)}
            />
            <span>Non-Stop</span>
          </label>
        </li>
        <li>
          <label htmlFor="one-stop">
            <input
              type="checkbox"
              onChange={handleInpChange}
              name="stops"
              value="1"
              id="one-stop"
              checked={stopList.includes(1)}
            />
            <span>1 Stop</span>
          </label>
        </li>
        <li>
          <label htmlFor="two-stops">
            <input
              type="checkbox"
              onChange={handleInpChange}
              name="stops"
              value="2"
              id="two-stops"
              checked={stopList.includes(2)}
            />
            <span>2 Stops</span>
          </label>
        </li>
      </ul>
    </div>
  );
};

export default StopsFilter;
