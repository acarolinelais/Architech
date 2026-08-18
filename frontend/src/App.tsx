import { Route, Routes } from "react-router-dom";

import { AboutPage } from "@/pages/AboutPage";
import { HomePage } from "@/pages/HomePage";
import { PostPage } from "@/pages/PostPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts/:slug" element={<PostPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
