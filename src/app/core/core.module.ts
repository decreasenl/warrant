import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  providers: [
    TranslatePipe
  ],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
