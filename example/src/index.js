import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import * as serviceWorker from "./serviceWorker";

const App = () => (
  <div>
    <h1 style={{ textAlign: "center" }}>Hello React</h1>
  </div>
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
serviceWorker.unregister();
