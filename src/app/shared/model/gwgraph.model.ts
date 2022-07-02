export class GameWeekGraphModel {
  Name: string;

  GWPoints: number;

  TotalPoints: number;

  GraphColor: string;

  ChipUsed: string;

  constructor(
    name: string,
    totalPoints: number,
    gwpoint: number,
    color: string,
    chipUsed: string
  ) {
    this.Name = name;
    this.TotalPoints = totalPoints;
    this.GWPoints = gwpoint;
    this.GraphColor = color;
    this.ChipUsed = chipUsed;
  }
}
