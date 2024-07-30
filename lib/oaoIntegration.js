const ethers = require("ethers");
const { OAO_ADDRESS, OAO_ABI } = require("./oaoConfig");
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const oaoContract = new ethers.Contract(OAO_ADDRESS, OAO_ABI, signer);

async function checkBalance() {
  const balance = await provider.getBalance(signer.address);
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);
  return balance;
}

async function checkNetworkAndGas() {
  const network = await provider.getNetwork();
  console.log(`Connected to network: ${network.name}`);
  
  const gasPrice = await provider.getGasPrice();
  console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
}

async function requestOAO(prompt, modelId) {
  try {
    await checkNetworkAndGas();
    const balance = await checkBalance();
    if (balance.eq(0)) {
      throw new Error("Account has no ETH. Please fund the account before making requests.");
    }

    const estimatedFee = await oaoContract.estimateFee(modelId);
    const bufferedFee = estimatedFee.mul(120).div(100); // Add 20% buffer
    const tx = await oaoContract.calculateAIResult(modelId, prompt, { 
      value: bufferedFee,
      gasLimit: 500000 // Set a reasonable gas limit
    });
    const receipt = await tx.wait();
    
    const requestEvent = receipt.events.find(e => e.event === "promptRequest");
    const requestId = requestEvent.args.requestId;

    // Wait for the callback
    return new Promise((resolve, reject) => {
      oaoContract.once("promptsUpdated", (updatedRequestId, updatedModelId, input, output) => {
        if (updatedRequestId.toString() === requestId.toString()) {
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

async function requestOAOWithRetry(prompt, modelId, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestOAO(prompt, modelId);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }
}

module.exports = { requestOAOWithRetry };
