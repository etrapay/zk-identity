import React from "react";

// Circomlib & ethers
import { buildPoseidon } from "circomlibjs";
import { BigNumber, ethers } from "ethers";

// Wagmi hooks
import { useAccount, useConnect, useSigner, useContract } from "wagmi";

// Contract ABI
import artifact from "./ABI/artifact.json";

// Local storage hook
import useLocalStorage from "use-local-storage";

function App() {
  const [id, setId] = React.useState<string>("49873835388");
  const [day, setDay] = React.useState<number>(0);
  const [month, setMonth] = React.useState<number>(0);
  const [year, setYear] = React.useState<number>(0);

  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  const { data: signer } = useSigner();

  const [leaf, setLeaf] = useLocalStorage("leaf", "");
  const [root, setRoot] = useLocalStorage("root", "");
  const [pathElements, setPathElements] = useLocalStorage("pathElements", "");
  const [pathIndices, setPathIndices] = useLocalStorage("pathIndices", "");

  const contract = useContract({
    address: "0x360Fd0a0EdF66dB30f89424443Bf6C0Af9Ed6646",
    abi: artifact.abi,
    signerOrProvider: signer,
  });

  const onRegister = async () => {
    try {
      if (id.length !== 11 || day === 0 || month === 0 || year === 0) return;

      const data = id.split("").map((x) => String(x));
      data.push(String(day));
      data.push(String(month));
      data.push(String(year));

      const poseidon = await buildPoseidon(14);
      const hash = poseidon(data.map((x) => BigNumber.from(x).toBigInt()));

      // Make the number within the field size
      const hashStr = poseidon.F.toString(hash);
      console.log(hashStr);

      const hashHex = BigNumber.from(hashStr).toHexString();
      // pad zero to make it 32 bytes, so that the output can be taken as a bytes32 contract argument
      const identity = ethers.utils.hexZeroPad(hashHex, 32);

      const t = await contract?.register(identity);
      // console.log(t.wait());
      const r = await t.wait();

      const { leaf, pathElements, pathIndices, root } = r.events[0].args;

      setLeaf(leaf);
      setRoot(root);
      setPathElements(pathElements);
      setPathIndices(pathIndices);
    } catch (e) {
      console.log(e);
    }
  };

  const onCheck = async () => {
    if (!leaf || !root || !pathElements || !pathIndices) return;

    const snarkjs = window.snarkjs;

    try {
      const input = {
        tc: ["7", "2", "9", "5", "6", "5", "5", "6", "2", "5", "2"],
        birthdate: ["2", "2", "2005"],
        currentdate: ["6", "3", "2023"],
        root: "3176374965215286996139141856407167738459476439549462353518042959695917572425",
        pathElements: [
          "21663839004416932945382355908790599225266501822907911457504978515578255421292",
          "8995896153219992062710898675021891003404871425075198597897889079729967997688",
          "15126246733515326086631621937388047923581111613947275249184377560170833782629",
          "6404200169958188928270149728908101781856690902670925316782889389790091378414",
          "17903822129909817717122288064678017104411031693253675943446999432073303897479",
          "11423673436710698439362231088473903829893023095386581732682931796661338615804",
          "10494842461667482273766668782207799332467432901404302674544629280016211342367",
          "17400501067905286947724900644309270241576392716005448085614420258732805558809",
          "7924095784194248701091699324325620647610183513781643345297447650838438175245",
          "3170907381568164996048434627595073437765146540390351066869729445199396390350",
        ],
        pathIndices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        leaf: "9446636441302590936210484803312685572524984347315367043401176974089965066742",
      };

      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        "zk.wasm", // wasm file built-in
        "zk.zkey", // zkey file built-in
        null
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="m-auto flex flex-col w-4/12">
        {leaf && root && pathElements && pathIndices ? (
          <div className="w-full h-full flex">
            <button
              className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 w-60 mx-auto"
              onClick={onCheck}
            >
              Check Age
            </button>
          </div>
        ) : (
          <>
            <p className="text-2xl text-center mx-auto">Zk Identity</p>
            <button
              className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 w-60 mx-auto"
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
            <div className="mt-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                TC
              </label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 text-center"
                placeholder="ID"
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-3 my-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Day
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  onChange={(e) => setDay(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Month
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  onChange={(e) => setMonth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Year
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
            </div>
            <button
              className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 w-60 mx-auto"
              onClick={onRegister}
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
