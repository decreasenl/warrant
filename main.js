var _a = require("electron"), app = _a.app, BrowserWindow = _a.BrowserWindow;
var url = require("url");
var mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
            // preload: path.join(app.getAppPath(), 'preload.js')
        }
    });
    mainWindow.loadURL(url.format({
        pathname: __dirname + "/dist/index.html",
        protocol: "file:",
        slashes: true
    }));
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}
app.on("ready", createWindow);
app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        app.quit();
});
app.on("activate", function () {
    if (mainWindow === null)
        createWindow();
});
