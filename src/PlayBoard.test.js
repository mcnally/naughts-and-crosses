import React from "react";
import ReactDOM from "react-dom";
import App from "./PlayBoard";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<PlayBoard />, div);
});
