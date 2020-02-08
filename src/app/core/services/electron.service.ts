import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  processes: Array<any>;


  get isElectron(): boolean {
    return ((<any>window).require);
  }

  constructor() {

    console.log(process);
    // Conditional imports
    if (this.isElectron) {  
      this.ipcRenderer = (<any>window).require('electron').ipcRenderer;
    }
  }

  require(lib: string) {
    if(!this.processes.find(p => p.lib === lib)) {
      var requiredInstance = (<any>window).require(lib);
      this.processes.push({lib: lib, instance: requiredInstance}); 
    }
    return this.processes.find(p => p.lib === lib);
  }
}