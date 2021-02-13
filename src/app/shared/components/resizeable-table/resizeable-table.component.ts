import { AfterContentChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { ProcessService } from 'src/app/core/services/process.service';

@Component({
  selector: 'warrant-resizeable-table',
  templateUrl: './resizeable-table.component.html',
  styleUrls: ['./resizeable-table.component.scss']
})
export class ResizeableTableComponent implements AfterContentChecked {

  @ViewChild('textArea') textArea: ElementRef;

  @Input() columns: Array<string> = [];
  @Input() dataSource: Array<any> = [];

  @Output() dataChanged = new EventEmitter();

  handled: Array<any> = [];
  dragging = false;
  selecting = false;
  editingCell: any = null;

  constructor(public processService: ProcessService) { 
    
  }

  ngAfterContentChecked(): void { 
    of(this.textArea).subscribe(a => {
      if (a) {
        a.nativeElement.focus();
      }
    });
  }


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
  editCell(row: any, column: any): void {
    this.editingCell = this.getCellReference(row, column);
  }

  getCellReference(row: any, column: any): string {
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
      let copied = `${Object.keys(this.dataSource.find(d => d)).join(spacing)}\r\n`;
      const entries = this.dataSource.filter(d => d.selected).map(d => Object.values(d).join(spacing));
      entries.forEach(e => copied = copied.concat(`${e}\r\n`));
      this.processService.clipboard.writeText(copied);
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

  saveData($event: KeyboardEvent, row: any, column: any, value: string): void {
    if ($event.ctrlKey && $event.key === 's') {
      this.dataChanged.emit({
        row, column, value
      });
    }
  }
}
