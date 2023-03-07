import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Wagmi Configurations
import { WagmiConfig } from "wagmi";
import wagmiClient from "./wagmi";

// Redux
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiConfig client={wagmiClient}>
        <App />
      </WagmiConfig>
    </Provider>
  </React.StrictMode>
);
