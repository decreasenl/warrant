import { HostListener, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutocompleteComponent } from 'src/app/shared/components/autocomplete/autocomplete.component';

@Injectable({
  providedIn: 'root'
})
export class Search {
  
  constructor(public dialog: MatDialog) { }


  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    console.log(event);
    if (true) {
      this.dialog.open(AutocompleteComponent, {
        panelClass: 'decrease-autocomplete',
        width: '800px'
      });
    }
  }
}
