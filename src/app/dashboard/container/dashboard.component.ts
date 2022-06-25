import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagerModel } from '../model/manager.model';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  isLoading: Observable<boolean>;

  data: Observable<Array<ManagerModel>>;

  constructor(private dashboardService: DashboardService) {
    this.isLoading = this.dashboardService.isLoading;
    this.data = this.dashboardService.data;
  }

  ngOnInit(): void {}

  onLeagueEntered(data: any) {
    this.dashboardService.getLeagueData(data, 10);
  }
}
