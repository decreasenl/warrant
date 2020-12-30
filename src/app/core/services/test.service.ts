import { Injectable } from "@angular/core";

import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  ipcRenderer: typeof ipcRenderer | undefined;
  webFrame: typeof webFrame | undefined;
  remote: typeof remote | undefined;
  childProcess: typeof childProcess | undefined;
  fs: typeof fs | undefined;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      console.log(this);
      console.log('oranfges')
      console.log('oranfges')
    }
  }

  public oranges() {
    console.log('i am printing oranges')
  }
}