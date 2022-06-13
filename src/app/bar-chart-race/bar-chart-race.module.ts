import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { InputTextModule } from 'primeng/inputtext';
import { KnobModule } from 'primeng/knob';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MaterialModule } from 'src/app/material.module';
import { BarChartRaceComponent } from './bar-chart-race.component';

@NgModule({
  declarations: [BarChartRaceComponent],
  imports: [
    BrowserAnimationsModule,
    MdbCheckboxModule,
    BrowserModule,
    FormsModule,
    InputTextModule,
    HttpClientModule,
    KnobModule,
    MatNativeDateModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [BarChartRaceComponent],
})
export class BarChartRaceModule {}
