import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Titlebar, Color } from 'custom-electron-titlebar'
import { Menu, MenuItem, shell } from 'electron';

import { ElectronService} from './core/services/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log(electronService.ipcRenderer)
    } else {
      console.log('Mode web');
    }


// Menu.setApplicationMenu(null);
// const menu = new Menu()

// menu.append(new MenuItem({
//   label: 'Print',
//   accelerator: 'Ctrl+P',
//   click: () => { 
//     shell
//    }
// }))

// menu.append(new MenuItem({
//   label:'CoinMarketCap',
//   click() { 
//       shell.openExternal('http://coinmarketcap.com')
//   },
//   accelerator: 'CmdOrCtrl+Shift+C'
// }));

//     const titleBar = new Titlebar({
//       backgroundColor: Color.fromHex('#1f2227'),
//       icon: '/assets/icons/favicon.png',
//       titleHorizontalAlignment: 'center',
//       menu: menu
//     });

//     titleBar.updateTitle();
    
  }
}
