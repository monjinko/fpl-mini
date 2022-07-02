import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ManagerModel } from '../shared/model/manager.model';
import { SeasonBWModel } from '../shared/model/seasonBW.model';

@Component({
  selector: 'season-highlights',
  templateUrl: './season-highlights.component.html',
  styleUrls: ['./season-highlights.component.css'],
})
export class SeasonHighlightsComponent implements OnInit {
  constructor() {}

  @Input() data: Array<ManagerModel>;

  @Output() displayBarChart = new EventEmitter();

  seasonBW: SeasonBWModel;

  ngOnInit(): void {
    this.getSeasonHighlightData();
  }

  getBestChip() {
    let seasonBWData = new SeasonBWModel();
    seasonBWData.SeasonBest = -1;
    seasonBWData.SeasonWorst = 1000;

    this.data.forEach((manager) => {
      for (const gw of manager.GWData) {
        if (gw.GWPoints > seasonBWData.SeasonBest) {
          seasonBWData.SeasonBest = gw.GWPoints;
          seasonBWData.SeasonBestName = manager.Name;
          seasonBWData.SeasonBestGW = gw.Event;
        }
        if (gw.GWPoints < seasonBWData.SeasonWorst) {
          seasonBWData.SeasonWorst = gw.GWPoints;
          seasonBWData.SeasonWorstName = manager.Name;
          seasonBWData.SeasonWorstGW = gw.Event;
        }
      }
    });
    this.seasonBW = seasonBWData;
  }

  emitDisplayBarChart() {
    this.displayBarChart.emit();
  }
  getSeasonHighlightData() {
    this.getBestChip();
  }
}
