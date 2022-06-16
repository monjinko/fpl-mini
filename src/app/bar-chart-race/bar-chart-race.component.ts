import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';
import { SubTitle } from 'chart.js';
import { interval, Subscription } from 'rxjs';
import { GameWeekGraphModel } from '../dashboard/model/gwgraph.model';
import { ManagerModel } from '../dashboard/model/manager.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ThisReceiver } from '@angular/compiler';

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
      if (managerData.length > 15) {
        maxLength = 20;
      } else {
        maxLength = managerData.length;
      }
      this.setUserRange(0, maxLength - 1);
      this.createBarChart();
    }
  }
  mySubscription: Subscription;

  splicedData: Array<ManagerModel>;

  chart: any;

  index: number = 0;

  play_color: string;

  pause_color: string;

  play_disable: boolean;

  pause_disable: boolean;

  formData = new FormGroup({
    gwSelected: new FormControl('', []),
  });

  private _data: Array<ManagerModel>;

  get data(): Array<ManagerModel> {
    return this._data;
  }

  private defaultColorArray = [
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

  tID: number | undefined;

  tickValue: number;

  constructor() {}

  ngOnInit(): void {}

  updateGW(event: number): void {
    let selectedGW = this.filterSelectedGW(event);
    let labels = selectedGW.map((gw) => gw.Name);
    let data = selectedGW.map((gw) => gw.TotalPoints);
    let color = selectedGW.map((gw) => gw.GraphColor);
    this.addData(this.chart, labels, data, color, event);
  }

  runTimelapse() {
    this.play_color = '60%';
    this.play_disable = true;
    this.pause_disable = false;
    this.pause_color = '100%';
    this.mySubscription = interval(900).subscribe((x) => {
      this.updateGW(this.index);
      this.tickValue = this.index;
      if (this.index > 38) {
        this.play_color = '100%';
        this.updateGW(38);
        this.index = 0;
        this.mySubscription.unsubscribe();
      }
      this.index++;
    });
  }

  stopTimelapse() {
    this.mySubscription.unsubscribe();
    this.pause_disable = true;
    this.pause_color = '60%';
    this.play_color = '100%';
    this.play_disable = false;
  }
  onSubmit() {
    this.updateGW(parseInt(this.formData.get('gwSelected')?.value));
  }

  setUserRange(firstIndex: number, secondIndex: number) {
    this.splicedData = this._data.splice(firstIndex, secondIndex);
    this.splicedData.forEach((manager, index) => {
      manager.ManagerGraphColor = this.defaultColorArray[index];
    });
  }

  createBarChart() {
    let selectedGW = this.filterSelectedGW(1);

    let labels = selectedGW.map((gw) => gw.Name);
    let data = selectedGW.map((gw) => gw.TotalPoints);
    let color = selectedGW.map((gw) => gw.GraphColor);

    const chartType: ChartType = 'bar';

    // var bar_ctx = <HTMLCanvasElement>document?.getElementById('canvas');
    // const ctx = bar_ctx?.getContext('2d');
    // const gradient = ctx?.createLinearGradient(0, 0, 0, 600);
    // gradient?.addColorStop(0, '#d45780');
    // gradient?.addColorStop(1, '#6a1c78');

    const data2 = {
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
      data: data2,
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
            text: 'Game Week ' + 1,
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
            max: 2750,
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
    chart.update();
  }

  filterSelectedGW(gw: number): Array<GameWeekGraphModel> {
    let gwArray = new Array<GameWeekGraphModel>();
    new Array<GameWeekGraphModel>();

    this.splicedData.forEach((element) => {
      const gwPoints = element.GWData.filter((obj) => obj.Event == gw).map(
        (gw) => gw.GWPoints
      );
      const totalPoints = element.GWData.filter((obj) => obj.Event == gw).map(
        (gw) => gw.TotalPoints
      );
      let selectedGW = new GameWeekGraphModel(
        element.Name,
        totalPoints[0],
        gwPoints[0],
        element.ManagerGraphColor
      );
      gwArray.push(selectedGW);
    });

    gwArray.sort((a, b) => b.TotalPoints - a.TotalPoints);
    return gwArray;
  }

  onInputChange(event: any) {
    this.updateGW(event.value);
    this.tickValue = event.value;
    this.index = event.value;
  }
}
