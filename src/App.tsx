import { BrowserRouter, Route, Routes } from "react-router-dom";
import CNNVisApp from "./pages/CNNVis";
import { DropoutEffect } from "./pages/DropoutEffect";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CNNVisApp />} />
        <Route path="/dropout-effect" element={<DropoutEffect />} />
      </Routes>
    </BrowserRouter>
  );
};
