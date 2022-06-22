import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';
import { SubTitle } from 'chart.js';
import { distinctUntilChanged, first, interval, Subscription } from 'rxjs';
import { GameWeekGraphModel } from '../dashboard/model/gwgraph.model';
import { ManagerModel } from '../dashboard/model/manager.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ThisReceiver } from '@angular/compiler';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const defaultColorArray = [
  '#31278f',
  '#76278f',
  '#278f4a',
  '#8f2727',
  '#8f2754',
  '#36151f',
  '#171536',
  '#193615',
  '#750162',
  '#283a45',
];

@Component({
  selector: 'bar-chart-race',
  templateUrl: './bar-chart-race.component.html',
  styleUrls: ['./bar-chart-race.component.css'],
})
export class BarChartRaceComponent {
  @Input() set data(managerData: Array<ManagerModel>) {
    if (managerData.length > 0) {
      this._data = managerData;
      let maxLength;
      if (this._data.length > 10) {
        maxLength = 10;
      } else {
        maxLength = this._data.length;
      }
      this.setRankRange(0, maxLength);
      if (this.chart != undefined) {
        this.updateGW(1);
        this.tickValue = 1;
        this.event = 1;
      } else {
        this.createBarChart();
      }
    }
  }
  mySubscription: Subscription;

  displayedColumns: string[] = ['Name', 'GWPoints', 'ChipUsed'];

  dataSource: Array<GameWeekGraphModel>;

  splicedData: Array<ManagerModel>;

  chart: any;

  event: number = 0;

  play_color: string;

  pause_color: string;

  play_disable: boolean;

  pause_disable: boolean;

  maxPoints: number;

  numberRegEx = /\-?\d*\.?\d{1,2}/;

  formData = new FormGroup({
    fromRank: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern(this.numberRegEx),
    ]),
    toRank: new FormControl('', [
      Validators.required,
      Validators.max(10),
      Validators.pattern(this.numberRegEx),
    ]),
  });

  private _data: Array<ManagerModel>;

  get data(): Array<ManagerModel> {
    return this._data;
  }

  tID: number | undefined;

  tickValue: number;

  constructor() {}

  ngOnInit(): void {}

  updateGW(event: number): void {
    let selectedGW = this.createSelectedGWDataArray(event);
    let labels = selectedGW.map((gw) => gw.Name);
    let data = selectedGW.map((gw) => gw.TotalPoints);
    let color = selectedGW.map((gw) => gw.GraphColor);
    this.addData(this.chart, labels, data, color, event);
  }

  runTimelapse() {
    if (this.event == 38) {
      this.event = 0;
    }
    this.play_color = '60%';
    this.play_disable = true;
    this.pause_disable = false;
    this.pause_color = '100%';
    this.mySubscription = interval(900).subscribe((x) => {
      this.updateGW(this.event);
      this.tickValue = this.event;
      if (this.event == 38) {
        this.play_color = '100%';
        this.play_disable = false;
        this.updateGW(38);
        this.event = 0;
        this.mySubscription.unsubscribe();
      }
      this.event++;
    });
  }

  stopTimelapse() {
    this.mySubscription.unsubscribe();
    this.pause_disable = true;
    this.pause_color = '60%';
    this.play_color = '100%';
    this.play_disable = false;
  }

  setRankRange(firstIndex: number, secondIndex: number) {
    this.splicedData = [...this._data].slice(firstIndex, secondIndex);
    this.splicedData.forEach((manager, index) => {
      manager.ManagerGraphColor = defaultColorArray[index];
    });

    this.splicedData.sort((a, b) => a.LeagueRank - b.LeagueRank);

    this.maxPoints =
      this.splicedData[0].GWData[this.splicedData[0].GWData.length - 1]
        .TotalPoints + 50;
  }

  updateRankRange() {
    let firstIndex = parseInt(this.formData.get('fromRank')?.value);
    let secondIndex = parseInt(this.formData.get('toRank')?.value);

    if (firstIndex > secondIndex) {
      this.formData.valid == false;
      this.formData.updateValueAndValidity();
    }

    this.setRankRange(firstIndex - 1, secondIndex);
    this.updateGW(this.event);
  }

  createBarChart() {
    let selectedGW = this.createSelectedGWDataArray(1);

    let labels = selectedGW.map((gw) => gw.Name);
    let data = selectedGW.map((gw) => gw.TotalPoints);
    let color = selectedGW.map((gw) => gw.GraphColor);

    const chartType: ChartType = 'bar';

    const initData = {
      labels: labels,
      datasets: [
        {
          axis: 'y',
          data: data,
          fill: false,
          backgroundColor: color,
          borderColor: 'white',
          borderRadius: 10,
          borderWidth: 2,
          datalabels: {
            color: 'white',
          },
        },
      ],
    };

    const chartConfig: ChartConfiguration = {
      plugins: [ChartDataLabels, SubTitle],
      type: chartType,
      data: initData,
      options: {
        indexAxis: 'y',
        layout: {
          padding: {
            top: 10,
            right: 30,
            left: 40,
            bottom: 10,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          subtitle: {
            display: true,
            text: 'Game Week ' + 0,
            color: 'white',
            position: 'bottom',
            font: {
              family: 'Bebas Neue',
              size: 30,
            },
          },
        },
        scales: {
          y: {
            ticks: { color: 'white' },
          },
          x: {
            min: 0,
            max: this.maxPoints,
          },
        },
      },
    };
    this.chart = new Chart('canvas', chartConfig);
  }

  addData(chart: Chart, label: any, data: any, color: any, event: number) {
    chart.data.labels = label;
    chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
      dataset.backgroundColor = color;
    });
    chart.options.plugins = {
      legend: {
        display: false,
      },
      subtitle: {
        display: true,
        text: 'Game Week ' + event,
        color: 'white',
        position: 'bottom',
        font: {
          family: 'Bebas Neue',
          size: 30,
        },
      },
    };
    chart.options.scales = {
      y: {
        ticks: { color: 'white' },
      },
      x: {
        min: 0,
        max: this.maxPoints,
      },
    };
    chart.update();
  }

  createSelectedGWDataArray(gw: number): Array<GameWeekGraphModel> {
    let gwArray = new Array<GameWeekGraphModel>();
    new Array<GameWeekGraphModel>();

    this.splicedData.forEach((element) => {
      const gwPoints = element.GWData.filter((obj) => obj.Event == gw).map(
        (gw) => gw.GWPoints
      );
      const totalPoints = element.GWData.filter((obj) => obj.Event == gw).map(
        (gw) => gw.TotalPoints
      );

      const chipsUsed = element.Chips.filter((obj) => obj.Event == gw).map(
        (gw) => gw.Name
      );

      const chip = this.convertChipName(chipsUsed[0]);

      let selectedGW = new GameWeekGraphModel(
        element.Name,
        totalPoints[0],
        gwPoints[0],
        element.ManagerGraphColor,
        chip
      );
      gwArray.push(selectedGW);
    });

    const gwGraphData = [...gwArray].sort(
      (a, b) => b.TotalPoints - a.TotalPoints
    );
    const gwSummaryData = gwArray.sort((a, b) => b.GWPoints - a.GWPoints);
    this.dataSource = gwSummaryData;
    return gwGraphData;
  }

  convertChipName(chip: string) {
    switch (chip) {
      case 'bboost':
        chip = 'Bench Boost';
        break;
      case '3xc':
        chip = 'Triple Captain';
        break;
      case 'freehit':
        chip = 'Free Hit';
        break;
      case 'wildcard':
        chip = 'Wild Card';
        break;
      default:
        break;
    }
    return chip;
  }

  onInputChange(event: any) {
    this.updateGW(event.value);
    this.tickValue = event.value;
    this.event = event.value;
  }
}
