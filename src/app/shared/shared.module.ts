import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    DialogComponent
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
    MatButtonModule
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class SharedModule { }
