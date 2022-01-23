import { ipcRenderer } from "electron";
import * as React from "react";
import { useState } from "react";
import { GetFile, WorkspaceLoaded } from "../communication/channels";

export function NavigationMenu() {
  ipcRenderer.removeAllListeners(WorkspaceLoaded);
  ipcRenderer.on(WorkspaceLoaded, (_event, args) => {
    console.log(args);
    setFiles(args);
  });

  const [files, setFiles] = useState([]);

  const onFileClick = (file) => {
    ipcRenderer.send(GetFile, file);
  };

  return (
    <ul>
      {files.map((file) => (
        <li key={file} onClick={onFileClick.bind(this, file)}>
          {file}
        </li>
      ))}
    </ul>
  );
}
