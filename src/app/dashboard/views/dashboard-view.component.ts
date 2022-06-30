import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ManagerModel } from '../model/manager.model';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css'],
})
export class DashboardViewComponent implements OnInit {
  @Input() isLoading: boolean;

  @Input() data: Array<ManagerModel>;

  @Output() leagueEntered = new EventEmitter();

  numberRegEx = /\-?\d*\.?\d{1,2}/;

  formData = new FormGroup({
    teamID: new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
  });

  leagueID: number;

  tID: number | undefined;

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    this.leagueID = this.formData?.get('teamID')?.value;
    this.leagueEntered.emit(this.leagueID);
  }
}
