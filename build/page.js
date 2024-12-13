// app/page.jsx
import { Suspense } from "react";
import React from "react";
import LikeButton from "./Like.js";
function Page() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, "hello server component"), /* @__PURE__ */ React.createElement(Suspense, { fallback: /* @__PURE__ */ React.createElement("h1", null, "loading...") }, /* @__PURE__ */ React.createElement(Post, null)));
}
async function getPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 3e3));
  return posts;
}
async function Post() {
  const posts = await getPosts();
  return /* @__PURE__ */ React.createElement("ul", null, posts.map((post) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", { key: post.id }, post.title), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(LikeButton, null)))));
}
export {
  Post,
  Page as default
};
