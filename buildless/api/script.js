// import { ProgramMetadata } from "@gear-js/api";

import { ApiPromise, WsProvider } from "@polkadot/api";
import { GearApi, ProgramMetadata } from "@gear-js/api";
import * as types from "@polkadot/types";
import * as util from "@polkadot/util";
import * as hashing from "@polkadot/util-crypto";
import uiKeyring from "@polkadot/ui-keyring";
import { html } from "htm/preact";
import { render } from "preact";

// mutating dom && listening to events
window.addEventListener("message", ({ data }) => {
  if (data.source === "react-devtools-content-script") {
    return;
  }
  console.log(new Date(), "got message", data);
  let a = document.createElement("div");
  render(html`<pre>${new Date().toISOString()}: ${data}</pre>`, a);
  app.appendChild(a);
});

function log(x) {
  window.postMessage(JSON.stringify(x, null, "  "));
}
window.log = log

const PROVIDER = "wss://testnet.vara.network";

log("Hi, this is a log");

log(`RPC Provider: ${PROVIDER}`)

async function initApi() {
  const provider = new WsProvider(PROVIDER);
  return await ApiPromise.create({ provider });
}

async function initGearApi() {
  return await GearApi.create({
    providerAddress: PROVIDER,
  })
}

log("api is initializing. Please hold on...");

window.api = await initApi();

log("gearApi is initializing. Please hold on...");

window.gearApi = await initGearApi();
window.types = types;
window.util = util;
window.hashing = hashing;
window.uiKeyring = uiKeyring;
uiKeyring.loadAll({
  isDevelopment: true,
  ss58Format: api.consts.system.ss58Prefix.toNumber(),
});
window.keyring = uiKeyring.keyring;

console.log("ss58 prefix:", api.consts.system.ss58Prefix.toNumber());

async function fetchMetadata() {
  let resp = await fetch("./hamster.meta.txt");
  let text = await resp.text();
  return ProgramMetadata.from(`0x${text}`);
}

let meta = await fetchMetadata();
window.meta = meta;

let result = await gearApi.programState.read({
    programId: "0x13cfe2d11888cf68cda5079dc22bc8c378588effdb5efae79dfbd230e12d4eef",
    payload: "0x",
  },
  meta,
);

log(result.toHuman());