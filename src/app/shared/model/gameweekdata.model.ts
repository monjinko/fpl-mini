export class GameWeekDataModel {
  Event: number;

  EventTransfers: number;

  GWPoints: number;

  TotalPoints: number;

  constructor(chips: any) {
    this.Event = chips.event;
    this.EventTransfers = chips.event_transfers;
    this.GWPoints = chips.points;
    this.TotalPoints = chips.total_points;
  }
}
