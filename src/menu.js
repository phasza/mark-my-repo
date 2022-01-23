import { dialog, Menu } from "electron";
import { GetFile, SendFile, WorkspaceLoaded } from "../communication/channels";
import { createWorkspace } from "./main/workspacemanager";

export function createMenu(mainWindow) {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Open Workspace",
          click() {
            openWorkspaceDialog(mainWindow).catch((e) => console.log(e));
          },
        },
        {
          label: "Exit",
          role: "close",
        },
      ],
    },
    {
      label: "Help",
      role: "help",
      click() {
        shell.openExternal("https://github.com/phasza/");
      },
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function openWorkspaceDialog(mainWindow) {
  const openDialogResult = await dialog.showOpenDialog(mainWindow, {
    title: "Select the workspace to open...",
    properties: ["openDirectory"],
  });

  if (!openDialogResult && openDialogResult.filePaths.length != 1) {
    return;
  }

  await initializeWorkspace(mainWindow, openDialogResult.filePaths[0]);
}

async function initializeWorkspace(mainWindow, directory) {
  const workspace = await createWorkspace(directory);

  // Subscribe to events from renderer
  // Reply event
  ipcMain.on(GetFile, (event, args) => {
    event.reply(SendFile, workspace.getFileContent(args));
  });

  // Send file list and initial file content
  // Initial events must be sent to the web content to reach the renderer
  // Later we can reply to events
  mainWindow.webContents.send(WorkspaceLoaded, workspace.files);
  mainWindow.webContents.send(SendFile, workspace.getFileContent(files[0]));
}
