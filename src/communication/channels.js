import { ipcMain, ipcRenderer } from "electron";

export const OpenWorkspace = "open-workspace";

export const WorkspaceLoaded = "workspace-loaded";

export const GetFile = "get-file";

export const SendFile = "send-file";

export function clearChannels() {
  [OpenWorkspace, GetFile, SendFile].forEach((i) => clearChannel(i));
}

function clearChannel(channel) {
  if (ipcMain) {
    ipcMain.removeAllListeners(channel);
  }

  if (ipcRenderer) {
    ipcRenderer.removeAllListeners(channel);
  }
}
