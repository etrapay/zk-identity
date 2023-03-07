import React from "react";

// Wagmi Hooks
import { useAccount, useConnect } from "wagmi";

const Register = ({
  onRegister,
  onYearChange,
  onIdChange,
  onDayChange,
  onMonthChange,
}: {
  onRegister: () => Promise<void>;
  onYearChange: (year: number) => void;
  onIdChange: (id: string) => void;
  onDayChange: (day: number) => void;
  onMonthChange: (month: number) => void;
}) => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <React.Fragment>
      <p className="text-2xl text-center mx-auto">Zk Identity</p>
      <button
        className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 mx-auto"
        onClick={() => {
          if (connectors.length > 0)
            connect({
              connector: connectors[0],
            });
        }}
      >
        {isConnected && address
          ? `Connected as ${address.slice(0, 6)}...${address.slice(-4)}`
          : "Connect Wallet"}
      </button>
      <div className="mt-2 poppins">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Enter TC (Turkish Citizen Number)
        </label>
        <input
          onChange={(e) => onIdChange(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 text-center"
          placeholder="ID"
        />
      </div>
      <label className="mb-2 font-medium text-sm mt-4 text-gray-900 block">
        Enter Your Birthday
      </label>
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            onChange={(e) => onDayChange(Number(e.target.value))}
            placeholder="Day"
          />
        </div>
        <div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            onChange={(e) => onMonthChange(Number(e.target.value))}
            placeholder="Month"
          />
        </div>
        <div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            onChange={(e) => onYearChange(Number(e.target.value))}
            placeholder="Year"
          />
        </div>
      </div>
      <button
        className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 min-w-max mx-auto"
        onClick={onRegister}
      >
        Register
      </button>
    </React.Fragment>
  );
};

export default Register;
