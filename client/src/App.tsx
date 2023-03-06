import { useAccount, useConnect } from "wagmi";

function App() {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

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
