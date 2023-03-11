import React from "react";

// Circomlib & ethers
import { buildPoseidon } from "circomlibjs";
import { BigNumber, ethers } from "ethers";

// Wagmi hooks
import {
  useAccount,
  useSigner,
  useContract,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

// Contract ABI
import artifact from "./ABI/artifact.json";

// Local storage hook
import useLocalStorage from "use-local-storage";

// Components
import {
  Register,
  Loading,
  Modal,
  Footer,
  Verify,
  ErrorModal,
  randomId,
} from "./components";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "./store/actions/actions";

function App() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  // Modal Visibility
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const { address } = useAccount();
  const { data: signer } = useSigner();

  // React States
  const [id, setId] = React.useState<string>("");
  const [day, setDay] = React.useState<number>(0);
  const [month, setMonth] = React.useState<number>(0);
  const [year, setYear] = React.useState<number>(0);

  // Local Storage
  const [leaf, setLeaf] = useLocalStorage("leaf", "");
  const [root, setRoot] = useLocalStorage("root", "");
  const [pathElements, setPathElements] = useLocalStorage("pathElements", "");
  const [pathIndices, setPathIndices] = useLocalStorage("pathIndices", "");
  const [lid, setlId] = useLocalStorage("lid", "");
  const [bday, setBday] = useLocalStorage("bday", "");

  const [isError, setIsError] = React.useState<string>("");

  // Redux
  const { loading } = useSelector((state: any) => state.main);
  const dispatch = useDispatch();

  // Contract
  const contract = useContract({
    address: "0xcbF35Df30f2E3E03fF480415E77719417Ab06181", // Deployed contract address
    abi: artifact.abi,
    signerOrProvider: signer,
  });

  /**
   * @description Function to handle the check button in Verify component
   * @dev This function will create in input for the proof and try to generate proof with snarkjs
   *       If the proof is valid, then it will send the proof to the contract and wait for the receipt
   *       If the proof is invalid, then it will show an error message to the user
   */
  const onCheck = async () => {
    if (!leaf || !root || !pathElements || !pathIndices || !lid || !bday)
      return;

    // Dispatch loading action
    dispatch(toggleLoading());

    // snarkjs
    const snarkjs = window.snarkjs;
    try {
      console.log("Proving...");

      // Fetching the current date for the proof
      const cday = new Date().getUTCDate();
      const cmonth = new Date().getMonth() + 1;
      const cyear = new Date().getFullYear();

      // Building the input for the proof
      const input = {
        tc: lid.split("").map((x) => BigNumber.from(x).toString()),
        birthdate: bday
          .split("/")
          .map((x) => BigNumber.from(parseInt(x)).toString()),
        currentdate: [
          BigNumber.from(cday).toString(),
          BigNumber.from(cmonth).toString(),
          BigNumber.from(cyear).toString(),
        ],
        root: BigNumber.from(root).toString(),
        pathElements: (pathElements as unknown as string[]).map((x) =>
          BigNumber.from(x).toString()
        ),
        pathIndices: pathIndices as unknown as number[],
        leaf: BigNumber.from(leaf).toString(),
      };

      // Creating input for the proof
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        "zk.wasm",
        "zk.zkey",
        null
      );

      // Format the proof for the contract
      const solProof = {
        a: [proof.pi_a[0].toString(), proof.pi_a[1].toString()],
        b: [
          [proof.pi_b[0][1].toString(), proof.pi_b[0][0].toString()],
          [proof.pi_b[1][1].toString(), proof.pi_b[1][0].toString()],
        ],
        c: [proof.pi_c[0].toString(), proof.pi_c[1].toString()],
        input: publicSignals.map((x: any) => x.toString()),
      };

      // Send transaction with proof if it is valid and wait for the receipt
      const t = await contract?.checkAge(solProof);
      await t.wait();

      dispatch({ type: "TOGGLE_LOADING" });
      setModalVisible(true);
    } catch (error: any) {
      console.log(error.message);
      dispatch({ type: "TOGGLE_LOADING" });

      if ((error.message as string).includes("user rejected transaction")) {
        setIsError("Transaction rejected");
      } else {
        setIsError(
          "Unable to create a proof. Either the TC number is incorrect, or you are not older than 18."
        );
      }
    }
  };

  /**
   * @description Function to handle the register button in Register component
   *  @dev This function will create the identity from the id, day, month and year with poseidon algorithm and then
   *      it will send the identity to the contract and wait for the receipt.
   *      After identity registered to the contract, all the required data will be saved in the local storage for the proof
   */
  const onRegister = async () => {
    dispatch({ type: "TOGGLE_LOADING" });
    try {
      // User should fill all the required fields
      if (id.length !== 11 || day === 0 || month === 0 || year === 0) return;

      // Build the identity from the id, day, month and year
      const data = id.split("").map((x) => String(x));
      data.push(...[String(day), String(month), String(year)]);

      // Poseidon hash builder
      const poseidon = await buildPoseidon();

      // Hash the data
      const hash = poseidon(data);

      // Convert hash to string
      const hashStr = poseidon.F.toString(hash);

      // Convert hash to hex
      const hashHex = BigNumber.from(hashStr).toHexString();

      // Pad the hash to 32 bytes for the contract
      const identity = ethers.utils.hexZeroPad(hashHex, 32);
      // Register identity
      const t = await contract?.register(identity);
      // If transaction has receipt, then it is successful and we can get the event data
      const r = await t.wait();
      const { leaf, pathElements, pathIndices, root } = r.events[0].args;

      // Save data to local storage (leaf, root, pathElements, pathIndices)
      setLeaf(leaf);
      setRoot(root);
      setPathElements(pathElements);
      setPathIndices(pathIndices);
      setlId(id);
      setBday(`${day}/${month}/${year}`);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: "TOGGLE_LOADING" });
    }
  };

  // We will generate random id for the user
  React.useEffect(() => {
    setId(randomId());
  }, []);

  return (
    <>
      {address && chain && chain.id !== 43113 && (
        <div
          className="w-screen h-screen absolute bottom-0 z-10 flex poppins"
          style={{
            background: "rgba(60, 60, 60, 0.4)",
          }}
        >
          <div className="m-auto bg-white opacity-100 w-11/12 sm:w-52 rounded-md py-4 flex flex-col">
            <p className="text-center">Wrong Network</p>
            <button
              className="text-white bg-red-400 hover:bg-red-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 mx-auto"
              onClick={() => switchNetwork!(43113)}
            >
              Switch Network
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-center h-screen poppins z-0">
        <ErrorModal
          visible={Boolean(isError.length)}
          onClose={() => setIsError("")}
          content={
            <div className="flex flex-col">
              <h2 className="text-center my-3">{isError}</h2>
              <img src="/error.png" alt="..." className="w-20 mx-auto" />
              <button
                className="text-white bg-red-400 hover:bg-red-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 w-60 mx-auto h-min mt-5"
                onClick={() => {
                  setIsError("");
                }}
              >
                OK!
              </button>
            </div>
          }
        />
        <Loading visible={loading} />
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          content={
            <>
              <h2 className="text-center my-3">You are eligible!</h2>
              <button
                className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 w-60 mx-auto h-min"
                onClick={() => {
                  window.open(
                    "https://www.youtube.com/watch?v=vZ734NWnAHA&ab_channel=StarWars",
                    "_blank"
                  );
                  setModalVisible(false);
                }}
              >
                Watch Movie
              </button>
            </>
          }
        />
        {leaf &&
        root &&
        pathElements &&
        pathIndices &&
        lid &&
        bday &&
        address ? (
          <Verify onCheck={onCheck} />
        ) : (
          <Register
            id={id}
            onRegister={() => onRegister()}
            onIdChange={(v: string) => setId(v)}
            onDayChange={(n: number) => setDay(Number(n))}
            onYearChange={(n: number) => setYear(Number(n))}
            onMonthChange={(n: number) => setMonth(Number(n))}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;
