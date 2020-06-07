import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input'
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';

import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { WebviewDirective } from './directives/';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreConnectionDialogComponent } from './components/dialog/store-connection-dialog/store-connection-dialog.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    StoreConnectionDialogComponent
  ],
  imports: [    
    BrowserModule,
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
    ReactiveFormsModule
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    StoreConnectionDialogComponent
  ]
})
export class SharedModule { }
