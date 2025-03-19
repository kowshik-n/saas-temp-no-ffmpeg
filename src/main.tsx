import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
if (import.meta.env.VITE_TEMPO === "true") {
  TempoDevtools.init();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
