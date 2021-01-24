import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from '@ngx-translate/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { WebviewDirective } from './directives/';

import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { StoreConnectionDialogComponent } from './components/dialog/store-connection-dialog/store-connection-dialog.component';
import { ResizeableTableComponent } from './components/resizeable-table/resizeable-table.component';
import { MatSortModule } from '@angular/material/sort';
import { ResizeableDirective } from './directives/resizeable/resizeable.directive';

const modules = [
  BrowserModule,
  BrowserAnimationsModule,
  CommonModule,
  TranslateModule,
  FormsModule,
  MatDialogModule,
  MatInputModule,
  MatIconModule,
  MatFormFieldModule,
  MatCommonModule,
  MatButtonModule,
  MatTabsModule,
  MatListModule,
  MatSelectModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  ReactiveFormsModule,
  MatExpansionModule,
  MatButtonModule,
  MatTableModule,
  MatSortModule,
  MatMenuModule,
  DragDropModule
];

const exported = [
  ResizeableTableComponent,
  ResizeableDirective
];

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    StoreConnectionDialogComponent,
    AutocompleteComponent,
    ...exported,
  ],
  imports: [
    ...modules
  ],
  exports: [
    ...modules,
    ...exported
  ],
  entryComponents: [
    StoreConnectionDialogComponent
  ]
})
export class SharedModule { }
