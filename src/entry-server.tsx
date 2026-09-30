import React from "react";
import { renderToString } from "react-dom/server";
import Site from "./Site";
export function render(url: string) {
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: new URL(url),
  });
  return renderToString(<Site />);
}
