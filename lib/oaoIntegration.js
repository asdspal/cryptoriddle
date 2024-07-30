import { ethers } from "ethers";
import { OAO_ABI, OAO_ADDRESS } from "./oaoConfig";

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const oaoContract = new ethers.Contract(OAO_ADDRESS, OAO_ABI, signer);

export async function requestOAO(prompt, modelId) {
  try {
    const tx = await oaoContract.requestCallback(modelId, prompt, ethers.constants.AddressZero, 0, "0x");
    const receipt = await tx.wait();
    const requestId = receipt.events.find(e => e.event === "AICallbackRequest").args.requestId;
    
    // Wait for the callback
    return new Promise((resolve, reject) => {
      oaoContract.once("AICallbackFulfilled", (reqId, output) => {
        if (reqId.toString() === requestId.toString()) {
          resolve(output);
        }
      });
      
      // Add a timeout in case the response doesn't come
      setTimeout(() => reject(new Error("OAO response timeout")), 60000);
    });
  } catch (error) {
    console.error("Error requesting OAO:", error);
    throw error;
  }
}
