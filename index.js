import { abi } from "./abi";
import Web3 from "web3";

const providerURL = process.env.providerURL;
const contractAddress = process.env.contractAddress;
const privateKey = process.env.privateKey;
// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL));
const NFTCONTRACT = new web3.eth.Contract(abi, contractAddress);

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const mintingAddress = "0x99B2c5C9767c70B261F07E9a50Ea07C24d7383A8";

function trigger() {
  console.log("triggered");
}
async function handler() {
  try {
// contract.methods.safeMint(mintingAddress).encodeABI();
    const tx = await NFTCONTRACT.methods.safeMint(mintingAddress).send({
      from: account.address,
      gas: await web3.eth.estimateGas({
        from: account.address,
        to: contractAddress,
        data: NFTCONTRACT.methods.safeMint(mintingAddress).encodeABI(),
      }),
    });

    console.log("Transaction Receipt:", tx);

    if (tx.events) {
      console.log(tx.events);

      if (tx.events.Minted) {
        console.log("events here ", tx.events.Minted);
        console.log("values",tx.events.Minted.returnValues);
        trigger()
      }
    }
    } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

handler();


