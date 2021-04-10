import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ProcessService } from 'src/app/core/services/process.service';

@Component({
  selector: 'warrant-resizeable-table',
  templateUrl: './resizeable-table.component.html',
  styleUrls: ['./resizeable-table.component.scss']
})
export class ResizeableTableComponent {

  @Input() columns: Array<string> = [];
  @Input() dataSource: Array<any> = [];

  @Output() dataChanged = new EventEmitter();

  @ViewChild('textArea') textArea: ElementRef;

  handled: Array<any> = [];
  dragging = false;
  selectingKeys = {
    ctrlKey: false,
    shiftKey: false
  };

  editingCell: any = null;
  hoveredCell: any = null;

  constructor(protected processService: ProcessService) { }

  protected onResize(target: HTMLElement): void {
    const column = Array.from(target.classList).find(t => t.includes('cdk-column'));
    const cells = target.parentElement.parentElement.querySelectorAll(`mat-cell.${column}`);
    cells.forEach(cell => {
      (cell as HTMLElement).style.width = target.style.width;
    });
  }

  protected select(target: any): void {
    if (!this.handled.includes(target)) {
      if (target.selected) {
        target.selected = false;
      } else {
        target.selected = true;
      }

      this.handled.push(target);
    }
  }

  protected mousedown(target: any): void {
    if (this.selectingKeys.ctrlKey) {
      this.select(target);
      return;
    }

    if (this.selectingKeys.shiftKey) {
      const targetIndex = this.dataSource.indexOf(target);
      const firstSelectedIndex = this.dataSource.findIndex(t => t.selected);
      this.dataSource.forEach((t, index) => {
        if (
          targetIndex > firstSelectedIndex && index >= firstSelectedIndex && index <= targetIndex
          || firstSelectedIndex > targetIndex && index <= firstSelectedIndex && index >= targetIndex
        ) {
          this.select(t);
        }
      });
    } else {
      this.dragging = true;
      this.resetSelection();
      this.select(target);
    }
  }

  protected mouseover(target: any): void {
    if (!this.dragging) {
      return;
    }

    this.select(target);
  }

  private resetSelection(): void {
    this.handled = [];
    this.dataSource = this.dataSource.map(r => {
      r.selected = false;
      return r;
    });
  }

  protected editCell(row: any, column: any, $event: KeyboardEvent): void {
    this.editingCell = this.getCellReference(row, column);
  }

  protected getCellReference(row: any, column: any): string {
    return Object.entries(row).find(e => e).toString() + column;
  }

  @HostListener('document:mouseup', ['$event'])
  protected stop(event: MouseEvent): void {
    this.dragging = false;
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
      let copied = `${Object.keys(this.dataSource.find(d => d)).join(spacing)}\r\n`;
      const entries = this.dataSource.filter(d => d.selected).map(d => Object.values(d).join(spacing));
      entries.forEach(e => copied = copied.concat(`${e}\r\n`));
      this.processService.clipboard.writeText(copied);
      return;
    }

    if (event.ctrlKey) {
      this.selectingKeys.ctrlKey = true;
      return;
    }

    if (event.shiftKey) {
      this.selectingKeys.shiftKey = true;
      return;
    }

    if (event.key === 'F2') {
      this.editingCell = this.hoveredCell;
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyUpHandler(event: KeyboardEvent): void {
    this.selectingKeys.ctrlKey = false;
    this.selectingKeys.shiftKey = false;
  }

  protected saveData($event: KeyboardEvent, row: any, column: any, value: string): void {
    if ($event.ctrlKey && $event.key === 's') {
      row[column] = value;
      this.dataChanged.emit(row);
    }
  }
}
