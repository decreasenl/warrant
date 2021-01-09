import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'warrant-resizeable-table',
  templateUrl: './resizeable-table.component.html',
  styleUrls: ['./resizeable-table.component.scss']
})
export class ResizeableTableComponent implements OnInit {

  @Input() columns: Array<string> = [];
  @Input() dataSource: Array<any> = [];

  constructor() { }

  ngOnInit(): void {
    console.log(this);
  }
}
