// frontend-app/src/main.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { useAuthStore } from "./store/authStore";

function Root() {
  useEffect(() => {
    // 🔥 hidratar auth al arrancar
    useAuthStore.getState().init();
  }, []);

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
