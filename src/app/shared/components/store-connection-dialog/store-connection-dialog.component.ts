import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'warrant-dialog',
  templateUrl: './store-connection-dialog.component.html',
  styleUrls: ['./store-connection-dialog.component.scss']
})
export class StoreConnectionDialogComponent implements OnInit {

  folders = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes= [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<StoreConnectionDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

}
