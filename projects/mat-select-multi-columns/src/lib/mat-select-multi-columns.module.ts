import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectMultiColumnsComponent } from './mat-select-multi-columns.component';

@NgModule({
  declarations: [MatSelectMultiColumnsComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMatSelectSearchModule
  ],
  exports: [MatSelectMultiColumnsComponent]
})
export class MatSelectMultiColumnsModule { }
