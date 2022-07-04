import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { least } from 'd3';
import { ManagerModel } from '../shared/model/manager.model';
import { SeasonBWModel } from '../shared/model/seasonBW.model';
import { BoldPipe } from '../shared/pipes/interpolation-bold.pipe';

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
    seasonBWData.MostTransfer =
      seasonBWData.MostExpensiveTeamValue =
      seasonBWData.SeasonBest =
      seasonBWData.MostTransferWeek =
        -1;
    seasonBWData.LeastTransfer =
      seasonBWData.SeasonWorst =
      seasonBWData.CheapestTeamValue =
        1000;

    this.data.forEach((manager) => {
      let leastTransfer = 0;
      let mostTransfer = 0;
      let mostTransferWeek = 0;

      for (const gw of manager.GWData) {
        leastTransfer += gw.EventTransfers;
        mostTransfer += gw.EventTransfers;
        mostTransferWeek = gw.EventTransfers;

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
        if (seasonBWData.MostTransferWeek < mostTransferWeek) {
          seasonBWData.MostTransferWeek = mostTransferWeek;
          seasonBWData.MostTransferWeekName = manager.Name;
          seasonBWData.MostTransferWeekGW = gw.Event;
        }
      }
      if (
        seasonBWData.MostExpensiveTeamValue <
        manager.GWData[manager.GWData.length - 1].TeamValue
      ) {
        seasonBWData.MostExpensiveTeamValue =
          manager.GWData[manager.GWData.length - 1].TeamValue;
        seasonBWData.MostExpensiveTeam = manager.Name;
      }
      if (
        seasonBWData.CheapestTeamValue >
        manager.GWData[manager.GWData.length - 1].TeamValue
      ) {
        seasonBWData.CheapestTeamValue =
          manager.GWData[manager.GWData.length - 1].TeamValue;
        seasonBWData.CheapestTeam = manager.Name;
      }

      if (seasonBWData.MostTransfer < mostTransfer) {
        seasonBWData.MostTransfer = mostTransfer;
        seasonBWData.MostTransferName = manager.Name;
      }
      if (seasonBWData.LeastTransfer > leastTransfer) {
        seasonBWData.LeastTransfer = leastTransfer;
        seasonBWData.LeastTransferName = manager.Name;
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
