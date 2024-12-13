"use client";
import {
  __toESM,
  require_react
} from "./chunk-DJBG7NA2.js";

// app/Like.jsx
var import_react = __toESM(require_react(), 1);
function LikeButton() {
  const [liked, setLiked] = import_react.default.useState(false);
  return /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setLiked((prev) => prev + 1) }, liked, " \u{1F44D}");
}
export {
  LikeButton as default
};

LikeButton.$$typeof = Symbol.for('react.client.reference');
LikeButton.$$id = "/Users/thiennq14/code/dev/react/react-server-scratch/build/Like.jsdefault";
      