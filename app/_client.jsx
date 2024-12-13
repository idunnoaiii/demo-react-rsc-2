import { createRoot } from "react-dom/client";
import { createFromFetch } from "react-server-dom-webpack/client.browser";

window.__webpack_require__ = async (id) => {
  return import(id);
};

const rootEl = document.getElementById("root");
const root = createRoot(rootEl);

createFromFetch(fetch("/rsc")).then((element) => {
  // console.log("ELEMENT", element);
  root.render(element);
});
