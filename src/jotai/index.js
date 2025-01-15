import { atom } from "jotai";

export const globalBooking = atom("Booking");
export const globalAirlineSearch = atom("");
export const globalAirLineMultiSearch = atom([]);
export const globalStopSearch = atom([]);
export const currentBooking = atom({});
export const formOpenToggle = atom(false);
export const airCraftListGlobal = atom([]);
export const airpostFilterGlobal = atom([]);