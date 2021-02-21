import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { Menu, MenuItem, shell } from 'electron';

import { ProcessService } from './core/services/process.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public processService: ProcessService,
    // private translate: TranslateService
  ) {
    // translate.setDefaultLang('en');

    if (processService.isElectron) {
      // console.log(process.env);
      // console.log('Mode electron');
      // console.log(processService.ipcRenderer);

    } else {
      console.log('Mode web');
    }
  }
}
