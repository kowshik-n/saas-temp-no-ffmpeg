import type { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/tempobook/pricing",
    element: { type: "pricing" },
  },
  {
    path: "/tempobook/settings",
    element: { type: "settings" },
  },
];

export default routes;
