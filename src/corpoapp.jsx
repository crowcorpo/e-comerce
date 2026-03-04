

import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Shope from "./shope.jsx";
import Page2 from "./page2.jsx";
import "./shope.css";
import "./page2.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Shope />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </HashRouter>
  );
}