import { app, BrowserWindow } from "electron";
import path from "node:path";
import process, { env } from "node:process";
import erarsBridge from "./bridge/erars";
import titleButtonBridge from "./bridge/titlebtn";

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
  });

  win.setMenu(null);

  if (env.mode === "DEV") {
    win.webContents.openDevTools();
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(process.cwd(), "dist/index.html"));
  }

  return win;
}

app.whenReady().then(() => {
  erarsBridge.init();
  const win = createWindow();
  titleButtonBridge.init(win);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    process.exit();
  }
});
