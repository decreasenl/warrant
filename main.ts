import { app, BrowserWindow, screen, Notification, Menu, MenuItem, shell} from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
    frame: false
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

// Menu.setApplicationMenu(null);
const menu = new Menu()

menu.append(new MenuItem({
  label: 'Print',
  accelerator: 'Ctrl+P',
  click: () => { 
    shell
   }
}))

menu.append(new MenuItem({
  label:'CoinMarketCap',
  click() { 
      shell.openExternal('http://coinmarketcap.com')
  },
  accelerator: 'CmdOrCtrl+Shift+C'
}))

Menu.setApplicationMenu(menu);

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {

  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  app.whenReady().then(() => {
    // Register a 'CommandOrControl+X' shortcut listener.
    const ret = require('globalShortcut').register('CommandOrControl+X', (d) => {
        
    })

  });

} catch (e) {
  // Catch Error
  // throw e;
}
