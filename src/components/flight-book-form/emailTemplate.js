import moment from "moment";
import { getDuration } from "../../utils/utilFn";

export const emailTemplate = (completeUserDetails, currentBookingGlobal) => {
  return `
  <!DOCTYPE html>
    <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flight Booking Confirmation</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .col-20 {
            width: 19%;
          }
          .flex {
            display: flex;
          }
          .space-bw {
            justify-content: space-between;
          }
          .align-center {
            align-items: center;
          }
          .booking-head h1 {
            color: #0E5B93;
            font-size: 32px;
          }
          .ticket-booked-area {
            border-top: 10px solid #0E5B93;
            padding: 15px;
            margin: 30px 0;
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 4px 15px 0 #00000013;
          }
          .ticket-booked-area p {
            font-size: 16px;
          }
          .ticket-booked-area h3 {
            font-size: 20px;
            color: #0E5B93;
          }
          .passenger-detail {
            border-bottom: 3px dotted #0E5B93;
            padding-bottom: 15px;
            position: relative;
            margin-bottom: 25px;
          }
          .main-ticket span {
            color: #000;
            font-size: 14px;
          }
          .main-ticket h3 {
            font-size: 32px;
            margin-bottom: 0;
          }
          .path-flight {
            position: relative;
            text-align: center;
          }
          .path-flight::before {
            border-top: 3px dotted #0E5B93;
            content: "";
            height: 2px;
            left: 0;
            position: absolute;
            top: calc(50% - 1px);
            width: 100%;
          }
          .path-flight .fa-location-dot {
            color: #0E5B93;
            left: -3px;
            position: absolute;
            top: calc(50% - 15px);
          }
          .path-flight .fa-plane {
            font-size: 24px;
            position: relative;
            top: 3px;
            z-index: 2;
          }
          .path-flight .fa-location-dot:last-child {
            left: auto;
            right: -3px;
          }
          .arrival-time p i {
            color: #0E5B93;
            margin-right: 5px;
            font-size: 18px;
            transform: rotate(-50deg);
          }
          .depart-time {
            padding-left: 20px;
          }
          .depart-time p i {
            transform: rotate(50deg);
          }
          .flight-time p {
            font-weight: 600;
            font-size: 16px;
          }
          .flight-time {
            margin: 20px 0;
          }
          .printer-icon {
            color: #0E5B93;
            font-size: 17px;
            font-weight: 600;
          }
          .printer-icon i {
            margin-right: 8px;
          }
          .bell-icon {
            padding: 10px 15px;
            border: 1px solid #DEB78B;
            background-color: #FFF3E1;
            margin-bottom: 10px;
          }
          .bell-icon i {
            margin-right: 10px;
            color: #94550d;
            font-size: 18px;
          }
          .bell-icon-blue {
            padding: 10px 15px;
            border: 1px solid #0E5B93;
            background-color: #D7E6FE;
            margin-bottom: 10px;
          }
          .bell-icon-blue i {
            color: #0E5B93;
          }
        </style>
      </head>

      <body>
        <div class="gap">
          <div class="container">
            <div class="cm-txt-center booking-head">
              <h1>Your flight is booked!</h1>
              <p>Pack your bags and prepare for adventure because your journey begins now! With your flight secured, the world is at your fingertips. Whether you're jetting off to a far-flung destination or returning to familiar skies, each flight is a new chapter in your travel story. So buckle up, sit back, and get ready to experience the thrill of exploration from the clouds above!</p>
            </div>
            ${completeUserDetails?.travelers?.map(item => {
    return `
              <div class="ticket-booked-area">
                <div class="passenger-detail">
                  <p>Passenger Name</p>
                  <h3>${item.firstName} ${item.lastName}</h3>
                </div>
                <div class="main-ticket">
                  <div class="flight-time flex space-bw">
                    <h4>${currentBookingGlobal.airlineName}</h4>
                    <p>${getDuration(currentBookingGlobal?.flData?.itineraries?.[0]?.duration) || ""}</p>
                  </div>
                  <div class="flex space-bw align-center">
                    <div class="col-20">
                      <span>From</span>
                      <h3>${currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode}</h3>
                      <span>${currentBookingGlobal?.airportNames?.[currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode?.toUpperCase()]?.name}</span>
                    </div>
                    <div class="arrival-time col-20">
                      <p>
                        <i class="fa-solid fa-plane"></i>Depart
                        <b>${moment(currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.[0]?.departure?.at)?.format("h:mm a")}</b>
                      </p>
                    </div>
                    <div class="col-20 path-flight">
                      <p>
                        <i class="fa-solid fa-location-dot cm-sec-col" aria-hidden="true"></i>
                        <i class="fa-solid fa-plane cm-prim-col" aria-hidden="true"></i>
                        <i class="fa-solid fa-location-dot cm-sec-col" aria-hidden="true"></i>
                      </p>
                    </div>
                    <div class="arrival-time depart-time col-20">
                      <p>
                        <i class="fa-solid fa-plane"></i>Arrival
                        <b>${moment(currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.[currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.length - 1]?.arrival?.at)?.format("h:mm a")}</b>
                      </p>
                    </div>
                    <div class="col-20">
                      <span>To</span>
                      <h3>${currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.[currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.length - 1]?.arrival?.iataCode}</h3>
                      <span>${currentBookingGlobal?.airportNames?.[currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.[currentBookingGlobal?.flData?.itineraries?.[0]?.segments?.length - 1]?.arrival?.iataCode?.toUpperCase()]?.name}</span>
                    </div>
                  </div>
                </div>
              </div>`;
  }).join("")}
          </div>
        </div>
      </body>

    </html>
  `;
};


