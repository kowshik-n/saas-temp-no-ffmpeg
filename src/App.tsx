import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./Home";
import routes from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { ProProvider } from "./context/ProContext";

function App() {
  // Handle Tempo routes for development environment
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <ProProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <p className="text-lg">Loading...</p>
          </div>
        }
      >
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Allow Tempo routes to be captured before any catch-all */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        <Toaster />
      </Suspense>
    </ProProvider>
  );
}

export default App;
