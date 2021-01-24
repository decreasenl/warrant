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

  onResize($event: HTMLElement): void {
    const resizedTarget = ($event as HTMLElement);

    const column = Array.from(resizedTarget.classList).find(c => c.includes('cdk-column'));
    const cells = resizedTarget.parentElement.parentElement.querySelectorAll(`mat-cell.${column}`);
    cells.forEach(cell => {
      (cell as HTMLElement).style.width = resizedTarget.style.width;
    });
  }
}
