import {
  isWeb3Injected,
  web3Accounts,
  web3AccountsSubscribe,
  web3Enable,
  web3EnablePromise,
  web3FromAddress,
  web3FromSource,
} from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";

async function initApi() {
  const PROVIDER = "wss://testnet.vara.network";
  const provider = new WsProvider(PROVIDER);
  return await ApiPromise.create({ provider });
}

console.log("isWeb3Injected:", isWeb3Injected);

console.log("api is initializing. Please hold on...");

window.api = await initApi();

if (!isWeb3Injected) {
  window.alert("Please install/enable polkadot.js extension");
}

function enableButtons() {
  signMessageButton.disabled = false;
  signTransactionButton.disabled = false;
  signMessageButton.classList.remove('opacity-50', 'cursor-not-allowed');
  signTransactionButton.classList.remove('opacity-50', 'cursor-not-allowed');
}

let wallets = [];
let accounts = []

// Add click event listener to the button
connectButton.addEventListener('click', async () => {
  console.log('connectButton clicked!');
  
  wallets = await web3Enable("page");

  console.log(JSON.stringify(wallets, null, '  '))

  accounts = await web3Accounts();

  console.log(JSON.stringify(accounts, null, "  "));

  enableButtons();
});

// Add click event listener to the button
signMessageButton.addEventListener('click', async () => {
  console.log('signMessageButton clicked!');

  let ALICE = accounts[0].address;
  
  // let { signer } = await web3FromSource("polkadot-js");
  // let { signer } = await web3FromSource("subwallet-js");

  // OR

  let { signer } = await web3FromAddress(ALICE);

  let { signature } = await signer.signRaw({
    address: ALICE,
    data: "Hello world",
    type: "payload",
  });
  
  console.log(signature);
});

// Add click event listener to the button
signTransactionButton.addEventListener('click', async () => {
  console.log('signTransactionButton clicked!');

  let ALICE = accounts[0].address;

  let { signer } = await web3FromAddress(ALICE);
  
  api.setSigner(signer);
  
  let tx = api.tx.system.remarkWithEvent("Hello");
  
  // await tx.signAndSend(ALICE);  

  // OR

  const unsub = await tx.signAndSend(ALICE, ({ status, events, dispatchError }) => {
    if (dispatchError) {
      if (dispatchError.isModule) {
        // for module errors, we have the section indexed, lookup
        const decoded = api.registry.findMetaError(dispatchError.asModule);
        const { docs, name, section } = decoded;
        console.log(`${section}.${name}: ${docs.join(' ')}`);
      } else {
        // Other, CannotLookup, BadOrigin, no extra info
        console.log(dispatchError.toString());
      }
      unsub(); // Unsubscribe on error
    } else if (status.isInBlock) {
      console.log(`Transaction included at blockHash ${status.asInBlock}`);
    } else if (status.isFinalized) {
      console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
      
      // Loop through all events
      events.forEach(({ event: { data, method, section } }) => {
        console.log(`\t' ${section}.${method}:: ${data}`);
      });

      // Unsubscribe from further updates
      unsub();
    }
  });

  console.log('Transaction submitted successfully');
});