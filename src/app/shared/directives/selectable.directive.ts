import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[warrantSelectable]'
})
export class SelectableDirective {

  constructor() { }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event.ctrlKey, event.key);
  }

}
