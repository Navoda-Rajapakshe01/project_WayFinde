import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const savedBookingData = JSON.parse(localStorage.getItem("pendingBooking"));

    if (!orderId || !savedBookingData) {
      setStatus("failed");
      return;
    }

    axios
      .get(`http://localhost:5030/api/payments/verify?orderId=${orderId}`)
      .then((res) => {
        if (res.data && res.data.status === "SUCCESS") {
          // Save booking to DB
          axios
            .post("http://localhost:5030/api/vehicle-reservations", {
              ...savedBookingData,
              orderId,
              paymentStatus: "Success",
            })
            .then(() => {
              localStorage.removeItem("pendingBooking");
              setStatus("success");
            })
            .catch(() => {
              setStatus("failed");
            });
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, []);

  return (
    <div className="payment-verification">
      {status === "verifying" && <p>Verifying payment, please wait...</p>}
      {status === "success" && (
        <div>
          <h2>Payment Successful! ✅</h2>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      )}
      {status === "failed" && (
        <div>
          <h2>Payment Failed ❌</h2>
          <button onClick={() => navigate("/")}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
