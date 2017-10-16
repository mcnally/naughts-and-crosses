import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PlayBoard from "./PlayBoard";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<PlayBoard />, document.getElementById("root"));
registerServiceWorker();
