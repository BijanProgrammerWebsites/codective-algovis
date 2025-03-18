import { Route, Routes } from "react-router";

import RootLayout from "@/layouts/root/root.layout.tsx";

import HomePage from "@/pages/home/home.page.tsx";
import NotFoundPage from "@/pages/not-found/not-found.page.tsx";
import ProblemPage from "@/pages/problem/problem.page.tsx";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="p/:id" element={<ProblemPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
