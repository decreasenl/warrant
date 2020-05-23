import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  openDialog()  {
    /*
      For some reason the .container-after-titlebar for the dialog doesnt have a z-index.
      Our application runs always on top
    */
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });
  }
}

