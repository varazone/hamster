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

log("Hi, this is a log");