import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { Titlebar, Color } from 'custom-electron-titlebar'


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
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }


    const titleBar = new Titlebar({
      backgroundColor: Color.fromHex('#1f2227'),
      icon: '/assets/icons/favicon.png',
      titleHorizontalAlignment: 'left'
    });

    titleBar.updateTitle();
  }
}
