import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';
import { SubTitle } from 'chart.js';
import { interval, Subscription } from 'rxjs';
import { GameWeekGraphModel } from '../dashboard/model/gwgraph.model';
import { ManagerModel } from '../dashboard/model/manager.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'bar-chart-race',
  templateUrl: './bar-chart-race.component.html',
  styleUrls: ['./bar-chart-race.component.css'],
})
export class BarChartRaceComponent {
  @Input() set data(managerData: Array<ManagerModel>) {
    if (managerData.length > 0) {
      this._data = managerData;
      this.createBarChart();
    }
  }
  mySubscription: Subscription;

  chart: any;

  index: number = 1;

  formData = new FormGroup({
    gwSelected: new FormControl('', []),
  });

  private _data: Array<ManagerModel>;

  get data(): Array<ManagerModel> {
    return this._data;
  }

  tID: number | undefined;

  constructor() {}

  ngOnInit(): void {}

  autoUpdate(event: number): void {
    let selectedGW = this.filterSelectedGW(event);
    let labels = selectedGW.map((gw) => gw.Name);
    let data = selectedGW.map((gw) => gw.TotalPoints);
    let color = selectedGW.map((gw) => gw.GraphColor);
    this.addData(this.chart, labels, data, color, event);
  }

  onSubmit() {
    this.index = 0;
    this.mySubscription = interval(800).subscribe((x) => {
      this.autoUpdate(this.index);
      if (this.index > 38) {
        this.autoUpdate(38);
        this.mySubscription.unsubscribe();
      }
      this.index++;
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
          borderRadius: 20,
          borderWidth: 1,
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
        plugins: {
          legend: {
            display: false,
          },
          subtitle: {
            display: true,
            text: 'something',
            color: 'white',
            position: 'bottom',
            font: {
              size: 30,
            },
          },
        },
        scales: {
          x: {
            min: 0,
            max: 2700,
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
          size: 30,
        },
      },
    };
    chart.update();
  }

  filterSelectedGW(gw: number): Array<GameWeekGraphModel> {
    let gwArray = new Array<GameWeekGraphModel>();
    new Array<GameWeekGraphModel>();

    this._data.forEach((element) => {
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
}
