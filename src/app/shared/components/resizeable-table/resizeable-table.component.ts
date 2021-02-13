import { Component, HostListener, Input } from '@angular/core';
import { ProcessService } from 'src/app/core/services/process.service';

@Component({
  selector: 'warrant-resizeable-table',
  templateUrl: './resizeable-table.component.html',
  styleUrls: ['./resizeable-table.component.scss']
})
export class ResizeableTableComponent {

  @Input() columns: Array<string> = [];
  @Input() dataSource: Array<any> = [];

  handled: Array<any> = [];
  dragging = false;
  selecting = false;
  editingCell: any = null;
  
  constructor(public processService: ProcessService) { }

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
    if (this.selecting) {
      this.select(target);
    } else {
      this.dragging = true;
      this.resetSelection();
      this.select(target);
    }
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
  }

  private resetSelection(): void {
    this.handled = [];
    this.dataSource = this.dataSource.map(r => {
      r.selected = false;
      return r;
    });
  }

  // Double click
  editCell(row, column): void {
    this.editingCell = this.getCellReference(row, column);
  }

  getCellReference(row, column): string {
    return Object.entries(row).find(e => e).toString() + column;
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent): void { 
    if (event.key === 'Escape') {
      this.resetSelection();
      this.editingCell = null;
      return;
    }

    if (event.ctrlKey && event.key === 'a' && !this.editingCell) {
      this.dataSource = this.dataSource.map(s => {
        s.selected = true;
        return s;
      });
      return;
    }
    if (event.ctrlKey && event.key === 'c') {
      const spacing = `   `;
      let headers = `${Object.keys(this.dataSource.find(d => d)).join(spacing)}\r\n`;
      const entries = this.dataSource.filter(d => d.selected).map(d => Object.values(d).join(spacing));
      entries.forEach(e => headers = headers.concat(`${e}\r\n`));
      this.processService.clipboard.writeText(headers);
      return;
    }

    if (event.ctrlKey) {
      this.selecting = true;
      return;
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyUpHandler(event: KeyboardEvent): void { 
    this.selecting = false;
  }
}
