import React from "react";

// Circomlib & ethers
import { buildPoseidon } from "circomlibjs";
import { BigNumber, ethers } from "ethers";

// Wagmi hooks
import { useAccount, useSigner, useContract } from "wagmi";

// Contract ABI
import artifact from "./ABI/artifact.json";

// Local storage hook
import useLocalStorage from "use-local-storage";

// Components
import { Register, Loading, Modal, Footer, Verify } from "./components";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "./store/actions/actions";

function App() {
  // Modal Visibility
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const { address } = useAccount();
  const { data: signer } = useSigner();

  // React States
  const [id, setId] = React.useState<string>("31872029776");
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

  // Redux
  const { loading } = useSelector((state: any) => state.main);
  const dispatch = useDispatch();

  // Contract
  const contract = useContract({
    address: "0x360Fd0a0EdF66dB30f89424443Bf6C0Af9Ed6646",
    abi: artifact.abi,
    signerOrProvider: signer,
  });

  const onCheck = async () => {
    if (!leaf || !root || !pathElements || !pathIndices || !lid || !bday)
      return;

    dispatch(toggleLoading());
    const snarkjs = window.snarkjs;

    try {
      console.log("Proving...");
      const cday = new Date().getUTCDate();
      const cmonth = new Date().getMonth() + 1;
      const cyear = new Date().getFullYear();

      const input = {
        tc: lid.split("").map((x) => BigNumber.from(x).toString()),
        birthdate: bday.split("/").map((x) => BigNumber.from(x).toString()),
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

      console.time();
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        "zk.wasm",
        "zk.zkey",
        null
      );
      console.timeEnd();

      const solProof = {
        a: [proof.pi_a[0].toString(), proof.pi_a[1].toString()],
        b: [
          [proof.pi_b[0][1].toString(), proof.pi_b[0][0].toString()],
          [proof.pi_b[1][1].toString(), proof.pi_b[1][0].toString()],
        ],
        c: [proof.pi_c[0].toString(), proof.pi_c[1].toString()],
        input: publicSignals.map((x: any) => x.toString()),
      };

      const t = await contract?.checkAge(solProof);
      await t.wait();

      dispatch({ type: "TOGGLE_LOADING" });
      setModalVisible(true);
    } catch (error: any) {
      dispatch({ type: "TOGGLE_LOADING" });

      if (
        (error.message as unknown as string).includes(
          "Error: Assert Failed. Error in template Example_145 line: 63"
        )
      ) {
        alert("Not eligible");
      } else {
      }
    }
  };

  const onRegister = async () => {
    dispatch({ type: "TOGGLE_LOADING" });
    try {
      // User should fill all the required fields
      if (id.length !== 11 || day === 0 || month === 0 || year === 0) return;
      const data = id.split("").map((x) => String(x));
      data.push(...[String(day), String(month), String(year)]);
      // Poseidon hash builder
      const poseidon = await buildPoseidon(14);
      const hash = poseidon(data.map((x) => BigNumber.from(x).toBigInt()));
      const hashStr = poseidon.F.toString(hash);
      const hashHex = BigNumber.from(hashStr).toHexString();
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

  return (
    <>
      <div className="flex justify-center h-screen poppins">
        <Loading visible={loading} />
        <Modal visible={modalVisible} onClose={() => setModalVisible(false)} />
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
