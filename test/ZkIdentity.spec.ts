// Imports
import { ethers } from "hardhat";
import { expect } from "chai";

// Helpers
import { getContractFactoryOfPoseidon } from "../scripts/generatePoseidon";

// Types
import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { extractLogArgs } from "./helpers";

describe.only("ZkIdentity", () => {
  let contract: Contract;
  let signer: SignerWithAddress;

  before(async () => {
    // Get signer
    [signer] = await ethers.getSigners();

    // Deploy Poseidon contract
    const hasher = await getContractFactoryOfPoseidon(2)
      .connect(signer)
      .deploy();

    await hasher.deployed();

    // Verifier Contract
    const verifier = await (await ethers.getContractFactory("Verifier"))
      .connect(signer)
      .deploy();

    await verifier.deployed();

    // Deploy ZkIdentity contract
    const ZkIdentity = await ethers.getContractFactory("ZkIdentity");
    contract = await ZkIdentity.deploy(hasher.address, verifier.address);

    await contract.deployed();
  });

  it("should be able to deploy", () => {
    expect(contract.address).to.be.properAddress;
  });

  it("should be able to insert a new identity", async () => {
    const _leaf = BigNumber.from(
      "9446636441302590936210484803312685572524984347315367043401176974089965066742"
    );

    const tx = await contract.register(_leaf);
    const args = extractLogArgs(await tx.wait(), "Register");

    const [sender, index, leaf, root, pathElements, pathIndices] = args.slice(
      0,
      6
    );

    const expectedRoot =
      "3176374965215286996139141856407167738459476439549462353518042959695917572425";
    const expectedPathElements = [
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
    ];
    const expectedPathIndicies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // expect(sender).to.equal(signer.address);
    expect(index).to.equal(1);
    expect(_leaf).to.equal(BigNumber.from(leaf).toString());
    expect(expectedRoot).to.equal(BigNumber.from(root).toString());
    expect(pathElements).to.deep.equal(
      (expectedPathElements as unknown as string[]).map((e) =>
        BigNumber.from(e).toString()
      )
    );
    expect(pathIndices).to.deep.equal(expectedPathIndicies);
  });

  it.skip("should return the current date", async () => {
    const date = await contract.getDate();
    console.log(date);
  });

  it("should verify proof", async () => {
    const proof = [
      [
        "0x29f63aa3225222830d8f4e183cb221b965aa855111baec121ba2a69a5b8f02b6",
        "0x05bf3507e6ed6215c67c6e0ba6051c3433ebbe7ebd0147445914791269f40ae8",
      ],
      [
        [
          "0x2a96927e03bd26ef593acda0327b6396e18e751f865525fddb4b986f370f5b64",
          "0x040420be0c1c8131698f7e813c9155e0ef1a675d247099627e4112ccf2fe1f7a",
        ],
        [
          "0x0de545a1ba410b024259b6300a75afe63bae37be9c0bd52aea1733953bf58368",
          "0x26d52dd2a620c2739efff66bc7dbfcee6ed54a7ecb463900a1b6dda8dfd2cb38",
        ],
      ],
      [
        "0x03532c8fdc737153a8665b4b89ed0f2c71b47fc278e6f9284c1f211a3d05eba3",
        "0x2d357bddfa938904ead9db07fa6fdf534ad89f6728bee9738a8148f50b3ac4be",
      ],
      [
        "0x14e29b53e9f3b6fb12c633476fb4463e35152fc569c906d1148109f4e654d9f6",
        "0x0000000000000000000000000000000000000000000000000000000000000006",
        "0x0000000000000000000000000000000000000000000000000000000000000003",
        "0x00000000000000000000000000000000000000000000000000000000000007e7",
        "0x0705c3b794231e5a64afa4087b6a8709d7da6794e8f96c95d88eb26c2bcb6149",
        "0x14e29b53e9f3b6fb12c633476fb4463e35152fc569c906d1148109f4e654d9f6",
      ],
    ];

    await contract.checkAge(proof);
  });
});
