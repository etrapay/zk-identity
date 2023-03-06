import { createClient, configureChains } from "wagmi";
import { avalancheFuji } from "@wagmi/core/chains";

import { publicProvider } from "wagmi/providers/public";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { chains, provider, webSocketProvider } = configureChains(
  [avalancheFuji],
  [publicProvider()]
);

console.log(chains);

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
  ],
});

export default wagmiClient;
