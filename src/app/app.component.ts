import { Component } from '@angular/core';
import { ElectronService } from './electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Warrant';

  constructor(public electronService: ElectronService) {
  // var mysql = require('mysql');
    // if(electronService.isElectron) {
    //   console.log('hello, im running electron');
    // }
  }
}
