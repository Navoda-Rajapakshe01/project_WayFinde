import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/CSS/ReserveVehicle.css";

const ReserveVehicle = () => {
  const navigate = useNavigate();

  // State to manage the active checklist topic
  const [activeTopic, setActiveTopic] = useState("arriveOnTime");

  // Handle menu button click
  const handleMenuClick = (topic) => {
    setActiveTopic(topic);
  };

  // Handle "Continue to Book" button click
  const handleContinue = () => {
    navigate("/VehicleBookingForm"); // Redirect to the booking form page
  };

  return (
    <div className="reserve-now">
      <h2>Pickup Checklist</h2>
      <div className="checklist-box">
        {/* Horizontal Menu */}
        <div className="checklist-menu">
          <button
            className={activeTopic === "arriveOnTime" ? "active" : ""}
            onClick={() => handleMenuClick("arriveOnTime")}
          >
            Arrive on Time
          </button>
          <button
            className={activeTopic === "whatToBring" ? "active" : ""}
            onClick={() => handleMenuClick("whatToBring")}
          >
            What to Bring
          </button>
          <button
            className={activeTopic === "refundableDeposit" ? "active" : ""}
            onClick={() => handleMenuClick("refundableDeposit")}
          >
            Refundable Deposit
          </button>
        </div>

        {/* Content Based on Active Topic */}
        <div className="checklist-content">
          {activeTopic === "arriveOnTime" && (
            <div className="checklist-item">
              <p>
                <ul>
                  <li>
                    Rental companies only allow you to get your keys at your
                    allocated pick-up time, they'll usually hold your car for a
                    limited time after you're due to pick it up - then it's
                    likely to be passed to another customer.
                  </li>
                  <li>
                    Make sure to arrive at least 15 minutes before your
                    scheduled pickup time.
                  </li>
                </ul>
              </p>
            </div>
          )}

          {activeTopic === "whatToBring" && (
            <div className="checklist-item">
              <p>
                When you pick the car up, you'll need:
                <ul>
                  <li>A passport or national ID card</li>
                  <li>All drivers to provide their driver's licence(s)</li>
                  <li>
                    A credit card in the main driver's name, to hold the
                    security deposit
                  </li>
                </ul>
              </p>
            </div>
          )}

          {activeTopic === "refundableDeposit" && (
            <div className="checklist-item">
              <p>
                At pick-up, the main driver will need € 700 available on their
                credit card for a refundable security deposit. Cash and debit
                cards aren't accepted.
                <br /> <b>Accepted cards: </b>Mastercard, Visa
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Continue to Book Button */}
      <button className="continue-button" onClick={handleContinue}>
        Continue to Book
      </button>
    </div>
  );
};

export default ReserveVehicle;
