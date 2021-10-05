import { MatSelectMultiColumnsModule } from 'projects/mat-select-multi-columns/src/public-api';
import { MatSelectSearchModule } from './../../projects/mat-select-search/src/lib/mat-select-search.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectSearchModule,
    MatSelectMultiColumnsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
