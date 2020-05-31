import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { DatabaseRoutingModule } from './database-routing.module';
import { DatabaseComponent } from './database.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DatabaseComponent],
  imports: [CommonModule, SharedModule, DatabaseRoutingModule, MatButtonModule]
})
export class DatabaseModule {}
