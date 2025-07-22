// PaymentSuccessPage.jsx
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");
    // Optionally: Call backend to confirm/resync reservation
  }, [params]);

  return (
    <div className="payment-success">
      <h1>Thank You for Your Booking!</h1>
      <p>Your payment was successful.</p>
    </div>
  );
};

export default PaymentSuccessPage;
