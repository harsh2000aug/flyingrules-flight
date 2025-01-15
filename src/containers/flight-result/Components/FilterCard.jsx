import React from "react";
import "./FilterCard.css";
import { countrySign } from "../../../utils/cuntryname";
import { useSelector } from "react-redux";
import { charges } from "../../../utils/charges";
import { getDuration } from "../../../utils/utilFn";

export default function FilterCard({ topFilter, setTopFilter, topFilterFirstData }) {
  const currency = useSelector((state) => state.currency);
  const calcTaxes = (val) => {
    let airlineTax = charges.airlineTaxes[val.validatingAirlineCodes[0]];
    if (!airlineTax) {
      airlineTax = charges.airlineTaxes.OTHER;
    }
    return (parseFloat(val?.price.total) * (airlineTax / 100)).toFixed(2);
  };
  return (
    <div className="sort-filter">
      <div className="flex space-bw">
        <div className={`col-33 ${topFilter === "Cheapest" && "active"}`} onClick={() => setTopFilter("Cheapest")}>
          <div className="filter-content">
            <h4>Cheapest</h4>
            {topFilterFirstData && topFilterFirstData?.length === 3
              &&
              <p>{`${countrySign[currency]}${(
                parseFloat(topFilterFirstData?.[0]?.price?.total) + parseFloat(calcTaxes(topFilterFirstData?.[0]))
              ).toFixed(2)} • ${getDuration(topFilterFirstData?.[0]?.itineraries?.[0]?.duration)}`}</p>
            }
          </div>
        </div>
        <div className={`col-33 ${topFilter === "Best" && "active"}`} onClick={() => setTopFilter("Best")}>
          <div className="filter-content">
            <h4>Best</h4>
            {topFilterFirstData && topFilterFirstData?.length === 3
              &&
              <p>{`${countrySign[currency]}${(
                parseFloat(topFilterFirstData?.[1]?.price?.total) + parseFloat(calcTaxes(topFilterFirstData?.[1]))
              ).toFixed(2)} • ${getDuration(topFilterFirstData?.[1]?.itineraries?.[0]?.duration)}`}</p>
            }
          </div>
        </div>
        <div className={`col-33 ${topFilter === "Quickest" && "active"}`} onClick={() => setTopFilter("Quickest")}>
          <div className="filter-content">
            <h4>Quickest</h4>
            {topFilterFirstData && topFilterFirstData?.length === 3
              &&
              <p>{`${countrySign[currency]}${(
                parseFloat(topFilterFirstData?.[2]?.price?.total) + parseFloat(calcTaxes(topFilterFirstData?.[2]))
              ).toFixed(2)} • ${getDuration(topFilterFirstData?.[2]?.itineraries?.[0]?.duration)}`}</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
