export class ChipsModel {
  Event: number;

  Name: string;

  Time: string;

  constructor(chips: any) {
    this.Event = chips.event;
    this.Name = chips.name;
    this.Time = chips.time;
  }
}
