"use client";

import React from "react";

export default function LikeButton() {
  const [liked, setLiked] = React.useState(false);
  return (
    <button onClick={() => setLiked((prev) => prev + 1)}>{liked} 👍</button>
  );
}
