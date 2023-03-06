// This script generates Poseidon contract factory for given number of inputs
import { ethers } from "hardhat";

// Poseidon abi and bytecode from `circomlibjs` library
import { poseidonContract } from "circomlibjs";

/**
 * It takes a number of inputs and returns a contract factory of Poseidon Contract
 * @param {number} numberOfInputs - The number of inputs that the contract will take.
 * @returns Poseidon contract factory
 */
const getContractFactoryOfPoseidon = (numberOfInputs: number) => {
  const bytecode = poseidonContract.createCode(numberOfInputs);
  const abiInJSON = poseidonContract.generateABI(numberOfInputs);
  const abi = new ethers.utils.Interface(abiInJSON);
  return new ethers.ContractFactory(abi, bytecode);
};

export { getContractFactoryOfPoseidon };
