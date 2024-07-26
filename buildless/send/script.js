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
import { GearApi, ProgramMetadata } from "@gear-js/api";

async function fetchMetadata() {
  let resp = await fetch("./hamster.meta.txt");
  let text = await resp.text();
  return ProgramMetadata.from(`0x${text}`);
}

let meta = await fetchMetadata();
window.meta = meta;

async function initGearApi() {
  return await GearApi.create({
    providerAddress: "wss://testnet.vara.network",
  })
}

console.log("gearApi is initializing. Please hold on...");

window.api = await initGearApi();

console.log("isWeb3Injected:", isWeb3Injected);

if (!isWeb3Injected) {
  window.alert("Please install/enable polkadot.js extension");
}

function enableButtons() {
  clickButton.disabled = false;
  clickButton.classList.remove('opacity-50', 'cursor-not-allowed');
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
clickButton.addEventListener('click', async () => {
  console.log('clickButton clicked!');

  let ALICE = accounts[0].address;

  let { signer } = await web3FromAddress(ALICE);
  
  api.setSigner(signer);

  let msg = {
    destination: "0x13cfe2d11888cf68cda5079dc22bc8c378588effdb5efae79dfbd230e12d4eef",
    payload: "Click",
    gasLimit: api.blockGasLimit,
    value: 0,
  };

  let tx = api.message.send(msg, meta);
    
  // await tx.signAndSend(ALICE， { nonce: -1 });  

  // OR
  
  const unsub = await tx.signAndSend(ALICE, { nonce: -1 }, ({ status, events, dispatchError }) => {
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

  let result = await api.programState.read({
      programId: "0x13cfe2d11888cf68cda5079dc22bc8c378588effdb5efae79dfbd230e12d4eef",
      payload: "0x",
    },
    meta,
  );
  console.log(result.toHuman());
});