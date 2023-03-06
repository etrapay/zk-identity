import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import wagmiClient from "./wagmi";
import { WagmiConfig } from "wagmi";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
