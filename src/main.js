import { app, BrowserWindow } from "electron";
import { clearChannels } from "./communication/channels";
import { createMenu } from "./menu";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

function createAppWindow() {
  clearChannels();

  const mainWindow = createMainWindow();

  createMenu(mainWindow);
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    //TODO change this for production
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  //TODO change this for production
  mainWindow.webContents.openDevTools();

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createAppWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createAppWindow();
  }
});
