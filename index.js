const { app, BrowserWindow, electron } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.setTitle;
  mainWindow.loadURL(
    // url.format({
    //   pathname: path.join(__dirname, `/dist/index.html`),
    //   protocol: "file:",
    //   slashes: true
    // })
    "http://localhost:4200/"
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// Enable live reload for Electron too
require("electron-reload")(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`),
});
