import { AfterContentInit, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[warrantSelectable]'
})
export class SelectableDirective implements AfterContentInit {

  @Input() selectableNodes: Array<any>;
  @Output() selected = new EventEmitter();

  private dragging = false;
  private isSelected = false;

  constructor() { }


  ngAfterContentInit(): void {
    if (!this.selectableNodes) {
      throw new Error('@Input() selectableNodes is required at this time. Selectable types have not been introduced just yet.');
    }
  }

  @HostListener('document:mousedown', ['$event'])
  click(event: MouseEvent): void {
    this.dragging = true;
    let target = (event.target as HTMLElement);
    if (!this.selectableNodes.includes(target.nodeName.toLowerCase())
        && this.selectableNodes.includes(target.parentNode.nodeName.toLowerCase())) {
      target = target.parentElement;
    }
    this.setSelected(target);
  }

  @HostListener('document:mouseup', ['$event'])
  stop(event: MouseEvent): void {
    console.log('release')
    this.dragging = false;
  }

  @HostListener('document:mouseover', ['$event'])
  drag(event: MouseEvent, ...args: any): void {
    if (this.dragging) {
      const target = (event.target as HTMLElement);
      this.setSelected(target);
    }
  }

  private setSelected(target: HTMLElement): void {
    if (this.isSelected) {
      return;
    }
    this.isSelected = true;
    this.selected.emit(target);
  }
}
