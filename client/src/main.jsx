import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SocketContext, socket } from "./context/SocketContext.jsx"
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketContext.Provider value={socket}>
    <App />
  </SocketContext.Provider>
);