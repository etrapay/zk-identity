import React from "react";
import { useAccount, useConnect } from "wagmi";

// import { buildPoseidon } from "circomlibjs";

function App() {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  // React.useEffect(() => {
  //   const setup = async () => {
  //     const p = await buildPoseidon(2);
  //     console.log(p([1, 2]).toString());
  //   };

  //   setup();
  // }, []);

  return (
    <div className="flex">
      {isConnected && <div>Connected to {activeConnector?.name}</div>}

      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector?.name}
          {isLoading &&
            pendingConnector?.id === connector.id &&
            " (connecting)"}
        </button>
      ))}

      {error && <div>{error.message}</div>}
      {address && <div className="">Address: {address}</div>}
    </div>
  );
}

export default App;
