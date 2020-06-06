import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { StoreConnectionDialogComponent } from './components/store-connection-dialog/store-connection-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    StoreConnectionDialogComponent
  ],
  imports: [
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
