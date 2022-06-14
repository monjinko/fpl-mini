import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ChipsModel } from '../model/chips.model';
import { GameWeekDataModel } from '../model/gameweekdata.model';
import { ManagerModel } from '../model/manager.model';

@Injectable()
export class DashboardService implements OnDestroy {
  leagueManagers = new Array<ManagerModel>();

  isLoading: Observable<boolean>;

  data: Observable<Array<ManagerModel>>;

  private leagueAPIURL =
    'https://fantasy.premierleague.com/api/leagues-classic/';

  private gwAPIURL = 'https://fantasy.premierleague.com/api/entry/';

  private _isLoading = new BehaviorSubject<boolean>(false);

  private _data = new BehaviorSubject<Array<ManagerModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(private http: HttpClient) {
    this.isLoading = this._isLoading.asObservable();
    this.data = this._data.asObservable();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  getLeagueData(id: number) {
    const url = `${this.leagueAPIURL}${id}/standings`;
    const gwEndpoints = new Array<Observable<any>>();
    this._isLoading.next(true);
    this.http
      ?.get(url)
      .pipe(
        switchMap((data: any): Observable<Array<ManagerModel>> => {
          const mngrArray = new Array<ManagerModel>();

          for (const player of data.standings.results) {
            let manager = new ManagerModel(player);
            mngrArray.push(manager);

            let allGWurl = `${this.gwAPIURL}${player.entry}/history/`;
            gwEndpoints.push(this.http?.get(allGWurl));
          }
          this.leagueManagers = mngrArray;

          return forkJoin(gwEndpoints);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (data: any) => {
          for (const [i, mng] of data.entries()) {
            let mngGW = new Array<GameWeekDataModel>();
            for (const gw of mng.current) {
              const gwData = new GameWeekDataModel(gw);
              mngGW.push(gwData);
            }
            this.leagueManagers[i].GWData.push(...mngGW);

            let mngChip = new Array<ChipsModel>();
            for (const chips of mng.chips) {
              const chipsData = new ChipsModel(chips);
              mngChip.push(chipsData);
            }
            this.leagueManagers[i].Chips.push(...mngChip);
          }
          this._isLoading.next(false);
          this._data.next(this.leagueManagers);
        },
        (error) => {
          this._isLoading.next(false);
          console.log(error);
          if (error.status == 404) {
            console.log('League Not Found');
          }
        }
      );
  }
}
