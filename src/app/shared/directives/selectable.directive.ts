import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[selectable]'
})
export class SelectableDirective {

  constructor() { }

  @HostListener('document:mousemove', ['$event'])
  oranges(event: MouseEvent): void {
    console.log(event);
  }

}
