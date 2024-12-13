import { Suspense } from "react";
import React from "react";
import LikeButton from "./Like.jsx";

export default function Page() {
  return (
    <>
      <h1>hello server component</h1>
      <Suspense fallback={<h1>loading...</h1>}>
        <Post />
      </Suspense>
    </>
  );
}

//https://jsonplaceholder.typicode.com/posts
async function getPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return posts;
}

export async function Post() {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post) => (
        <>
          <li key={post.id}>{post.title}</li>
          <div>
            <LikeButton />
          </div>
        </>
      ))}
    </ul>
  );
}
