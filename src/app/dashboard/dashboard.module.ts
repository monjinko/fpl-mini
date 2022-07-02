import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { InputTextModule } from 'primeng/inputtext';
import { KnobModule } from 'primeng/knob';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { DashboardComponent } from './container/dashboard.component';
import { MaterialModule } from 'src/app/material.module';
import { DashboardViewComponent } from './views/dashboard-view.component';
import { DashboardService } from './services/dashboard.service';
import { ManagerModel } from '../shared/model/manager.model';
import { BarChartRaceModule } from '../bar-chart-race/bar-chart-race.module';

@NgModule({
  declarations: [DashboardComponent, DashboardViewComponent],
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
    BarChartRaceModule,
  ],
  providers: [DashboardService],
  exports: [DashboardComponent],
})
export class DashboardModule {}
