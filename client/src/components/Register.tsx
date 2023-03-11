// Wagmi Hooks
import { useAccount, useConnect } from "wagmi";

// Helpers
import { randomId } from "./helpers";

// React Icons
import { FaRandom } from "react-icons/fa";

const Register = ({
  onRegister,
  onYearChange,
  onIdChange,
  onDayChange,
  onMonthChange,
  id,
}: {
  onRegister: () => Promise<void>;
  onYearChange: (year: number) => void;
  onIdChange: (id: string) => void;
  onDayChange: (day: number) => void;
  onMonthChange: (month: number) => void;
  id: string;
}) => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <div className="m-auto flex flex-col w-11/12 md:w-6/12">
      <p className="text-2xl text-center mx-auto">Zk Identity</p>
      <button
        className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 mx-auto my-5"
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
          Enter TC (Turkish Citizen Number){" "}
        </label>

        <div className="relative w-full">
          <input
            onChange={(e) => onIdChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 text-center"
            placeholder="ID"
            value={id}
          />
          <button
            type="submit"
            className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white rounded-r-lg bg-black h-full"
            onClick={() => {
              const id = randomId();
              onIdChange(id);
            }}
          >
            <FaRandom />
          </button>
        </div>
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
        className={`text-white font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 min-w-max mx-auto ${
          isConnected
            ? "bg-yellow-400 hover:bg-yellow-500"
            : "bg-gray-400 cursor-not-allowed"
        }"}`}
        onClick={onRegister}
      >
        Register
      </button>
    </div>
  );
};

export default Register;
