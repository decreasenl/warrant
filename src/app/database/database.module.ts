import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { DatabaseRoutingModule } from './database-routing.module';
import { DatabaseComponent } from './database.component';

@NgModule({
  declarations: [DatabaseComponent],
  imports: [CommonModule, SharedModule, DatabaseRoutingModule]
})
export class DatabaseModule {}
