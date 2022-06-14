import { ChipsModel } from './chips.model';
import { GameWeekDataModel } from './gameweekdata.model';

export class ManagerModel {
  MID: number;

  Name: string;

  UserName: string;

  LeagueRank: number;

  Chips: Array<ChipsModel>;

  GWData: Array<GameWeekDataModel>;

  ManagerGraphColor: string;

  constructor(manager: any) {
    this.MID = manager.entry;
    this.Name = manager.entry_name;
    this.UserName = manager.player_name;
    this.LeagueRank = manager.last_rank;
    this.Chips = new Array<ChipsModel>();
    this.GWData = new Array<GameWeekDataModel>();
  }
}
