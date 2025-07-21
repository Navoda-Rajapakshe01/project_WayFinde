import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider } from "./Components/Authentication/AuthContext/AuthContext";
<script
  type="text/javascript"
  src="https://www.payhere.lk/lib/payhere.js"></script>;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
