// path: test/helpers.ts
// Imports
import { ethers } from "hardhat";

// Types
import { TransactionReceipt } from "@ethersproject/abstract-provider";

/**
 * It takes a transaction receipt and an event name, and returns the arguments of the event with the
 * given name
 * @param receipt - The transaction receipt returned by the transaction.
 * @param {string} eventName - The name of the event you want to extract the arguments from.
 * @returns The return value of the function is the event args.
 */
export const extractLogArgs = (
  receipt: TransactionReceipt & { events: { event: string; args: string[] }[] },
  eventName: string
) => {
  const event = receipt.events.find((e) => e.event === eventName);

  if (!event) {
    throw new Error(`Event ${eventName} not found`);
  }

  return event.args;
};
