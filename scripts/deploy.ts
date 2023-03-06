import { ethers } from "hardhat";

// Helper function
import { getContractFactoryOfPoseidon } from "./generatePoseidon";

async function main() {
  const [signer] = await ethers.getSigners();

  // Deploy Poseidon contract
  const hasher = await getContractFactoryOfPoseidon(2).connect(signer).deploy();
  await hasher.deployed();

  console.log("Poseidon deployed to:", hasher.address);

  // Verifier Contract
  const verifier = await (await ethers.getContractFactory("Verifier"))
    .connect(signer)
    .deploy();
  await verifier.deployed();

  console.log("Verifier deployed to:", verifier.address);

  // Deploy ZkIdentity contract
  const ZkIdentity = await ethers.getContractFactory("ZkIdentity");
  const contract = await ZkIdentity.deploy(hasher.address, verifier.address);

  await contract.deployed();

  console.log("ZkIdentity deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
