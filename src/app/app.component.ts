import { Component } from '@angular/core';
import { ForecastData, Weather, ChartOptions } from '../@model/weather.model';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import Swal from 'sweetalert2';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  // standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';
  loading = false;
  myDate = new Date().toISOString();
  maxDate: string = '';
  weatherList: Weather[] = [];
  dateArray: string[] = [];
  errorDateArray: Date[] = [];
  forecastArray: ForecastData[] = [];
  // set initial state of ag-grid
  colDefs: (ColDef | ColGroupDef)[] = [
    { headerName: 'Date', field: 'date', width: 110 },
    {
      headerName: 'Temperature',
      children: [
        { headerName: 'Low', field: 'temperature.low' },
        { headerName: 'High', field: 'temperature.high' },
      ],
    },
    {
      headerName: 'Relative Humidity',
      children: [
        { headerName: 'Low', field: 'relativeHumidity.low' },
        { headerName: 'High', field: 'relativeHumidity.high' },
      ],
    },
  ];
  // set initial state of HighChart
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: ChartOptions = {
    temperatureChart: {
      chart: {
        type: 'spline',
      },
      title: {
        text: 'Temperature',
      },
      subtitle: {
        text: 'Source: <a href="https://beta.data.gov.sg/collections/1456/datasets/d_1efe4728b2dad26fd7729c5e4eff7802/view" target="_blank">sg.gov</a>',
      },
      xAxis: {
        categories: [],
        accessibility: {
          description: 'Date of past 30 days',
        },
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {
          format: '{value}°',
        },
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1,
          },
        },
      },
      series: [
        {
          type: 'spline',
          name: 'High',
          marker: {
            symbol: 'square',
          },
          data: [],
        },
        {
          type: 'spline',
          name: 'Low',
          marker: {
            symbol: 'diamond',
          },
          data: [],
        },
      ],
    },
    humidityChart: {
      chart: {
        type: 'spline',
      },
      title: {
        text: 'Relative Humidity',
      },
      subtitle: {
        text: 'Source: <a href="https://beta.data.gov.sg/collections/1456/datasets/d_1efe4728b2dad26fd7729c5e4eff7802/view" target="_blank">sg.gov</a>',
      },
      xAxis: {
        categories: [],
        accessibility: {
          description: 'Date of past 30 days',
        },
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {
          format: '{value}%',
        },
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1,
          },
        },
      },
      series: [
        {
          type: 'spline',
          name: 'High',
          marker: {
            symbol: 'square',
          },
          data: [],
        },
        {
          type: 'spline',
          name: 'Low',
          marker: {
            symbol: 'diamond',
          },
          data: [],
        },
      ],
    },
  };

  // set the limit of date-input by the API status
  constructor() {
    this.calculateMaxDate();
  }

  // 4-day api can only show data for 4 more days
  calculateMaxDate() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 4);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  // make the array to call 4-day api
  calculateDates(startingDate: string): string[] {
    this.dateArray = [];
    let currentDate = new Date(startingDate);

    for (let i = 0; i < 30 / 4; i++) {
      currentDate.setDate(currentDate.getDate() - 4);
      // Format the date as a string (YYYY-MM-DD) and push it to the array
      this.dateArray.push(currentDate.toISOString().split('T')[0]);
    }
    // console.log(this.dateArray);
    return this.dateArray;
  }
  // date-input component
  handleDate() {
    if (this.myDate > this.maxDate) {
      Swal.fire({
        title: 'OOPS',
        text: 'No Forecast data',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    const resultDates = this.calculateDates(this.myDate);
    // console.log(resultDates);
  }

  // confirm button component
  getData() {
    if (this.dateArray.length === 0) {
      Swal.fire({
        title: 'OOPS',
        text: 'Please Pick a Date',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.forecastArray = [];
    this.errorDateArray = [];
    this.loading = true;

    const fetchDataForDate = async (date: string) => {
      try {
        const response = await fetch(
          `https://api.data.gov.sg/v1/environment/4-day-weather-forecast?date=${date}`
        );
        const result = await response.json();
        this.weatherList = result.items;
        this.weatherList[0].forecasts.forEach((forecast) => {
          const data: ForecastData = {
            date: forecast.date,
            relativeHumidity: forecast.relative_humidity,
            temperature: forecast.temperature,
          };
          this.forecastArray.push(data);
        });
      } catch (error) {
        const errorIndex = this.dateArray.indexOf(date);
        for (let i = 1; i <= 4; i++) {
          const errorDate = new Date(this.dateArray[errorIndex]);
          errorDate.setDate(errorDate.getDate() + i);
          const newDate = errorDate.toISOString().split('T')[0];
          try {
            await fetch(
              `https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?date=${newDate}`
            )
              .then((res) => {
                return res.json();
              })
              .then((response) => {
                const data: ForecastData = {
                  date: newDate,
                  relativeHumidity: response.items[0].general.relative_humidity,
                  temperature: response.items[0].general.temperature,
                };
                this.forecastArray.push(data);
              });
          } catch (innerError) {
            // console.log(innerError)
            // console.log(newDate)
            this.errorDateArray.push(errorDate);
          }
        }
      }
      this.forecastArray.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const last30Items = this.forecastArray.slice(0, 30);
      this.forecastArray = last30Items;
    };

    const fetchAllData = async () => {
      for (const date of this.dateArray) {
        await fetchDataForDate(date);
      }
      this.updateChart();
      this.loading = false;
    };

    fetchAllData();
  }

  updateChart() {
    if (this.forecastArray.length < 30) {
      const alertArray: any = [];
      this.errorDateArray.sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );
      this.errorDateArray.forEach((date) => {
        alertArray.push(date.toISOString().split('T')[0]);
      });
      Swal.fire({
        text: `Sorry, no data for ${alertArray}.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }

    // Create new highcharts
    const temperatureChartOptions: Highcharts.Options = {
      ...this.chartOptions,
      xAxis: {
        categories: this.forecastArray.map((item) => item.date),
      },
      series: [
        {
          type: 'spline',
          data: this.forecastArray.map((item) => item.temperature.high),
        },
        {
          type: 'spline',
          data: this.forecastArray.map((item) => item.temperature.low),
        },
      ],
    };

    const humidityChartOptions: Highcharts.Options = {
      ...this.chartOptions,
      xAxis: {
        categories: this.forecastArray.map((item) => item.date),
      },
      series: [
        {
          type: 'spline',
          data: this.forecastArray.map((item) => item.relativeHumidity.high),
        },
        {
          type: 'spline',
          data: this.forecastArray.map((item) => item.relativeHumidity.low),
        },
      ],
    };

    this.chartOptions.temperatureChart = temperatureChartOptions;
    this.chartOptions.humidityChart = humidityChartOptions;
  }

}
