import { Component, HostListener, Input } from '@angular/core';
import { TouchBarScrubber } from 'electron';

@Component({
  selector: 'warrant-resizeable-table',
  templateUrl: './resizeable-table.component.html',
  styleUrls: ['./resizeable-table.component.scss']
})
export class ResizeableTableComponent {

  @Input() columns: Array<string> = [];
  @Input() dataSource: Array<any> = [];

  selected: Array<any> = [];
  handled: Array<any> = [];

  dragging = false;

  constructor() { }

  onResize(target: HTMLElement): void {
    const column = Array.from(target.classList).find(t => t.includes('cdk-column'));
    const cells = target.parentElement.parentElement.querySelectorAll(`mat-cell.${column}`);
    cells.forEach(cell => {
      (cell as HTMLElement).style.width = target.style.width;
    });
  }

  select(target: any): void {
    if (!this.handled.includes(target)) {
      if (target.selected) {
        target.selected = false;
      } else { 
        target.selected = true;
      }

      this.handled.push(target);
    }
  }

  mousedown(target: any): void {
    this.resetSelection();
    this.dragging = true;

    this.select(target);
  }

  mouseover(target: any): void {
    if (!this.dragging) {
      return;
    }

    this.select(target);
  }

  @HostListener('document:mouseup', ['$event'])
  stop(event: MouseEvent): void {
    this.dragging = false;
    
    console.log('stopped dragging');
  }

  private resetSelection(): void {
    this.handled = [];
    this.dataSource = this.dataSource.map(r => {
      r.selected = false;
      return r;
    });
  }
}
