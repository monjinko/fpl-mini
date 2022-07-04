export class GameWeekDataModel {
  Event: number;

  EventTransfers: number;

  GWPoints: number;

  TotalPoints: number;

  TeamValue: number;

  constructor(chips: any) {
    this.Event = chips.event;
    this.EventTransfers = chips.event_transfers;
    this.GWPoints = chips.points;
    this.TotalPoints = chips.total_points;
    this.TeamValue = chips.value / 10;
  }
}
