import * as React from "react";
import Parser from "html-react-parser";
import { ipcRenderer } from "electron";
import { useState } from "react";
import { SendFile } from "../communication/channels";

export function MarkdownContainer() {
  ipcRenderer.removeAllListeners(SendFile);
  ipcRenderer.on(SendFile, (_event, args) => {
    setContent(args);
  });

  const [content, setContent] = useState("");

  return <div>{content ? Parser(content) : ""}</div>;
}
