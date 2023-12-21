export class Weather {
    update_timestamp: string;
    timestamp: string;
    forecasts: Forecast[];
  
    constructor(
      update_timestamp: string,
      timestamp: string,
      forecasts: Forecast[]
    ) {
      this.update_timestamp = update_timestamp;
      this.timestamp = timestamp;
      this.forecasts = forecasts;
    }
  }
  
  export class Forecast {
    temperature: {
      low: number;
      high: number;
    };
    date: string;
    forecast: string;
    relative_humidity: {
      low: number;
      high: number;
    };
    wind: {
      speed: {
        low: number;
        high: number;
      };
      direction: string;
    };
    timestamp: string;
  
    constructor(
      temperature: { low: number; high: number },
      date: string,
      forecast: string,
      relative_humidity: { low: number; high: number },
      wind: { speed: { low: number; high: number }; direction: string },
      timestamp: string
    ) {
      this.temperature = temperature;
      this.date = date;
      this.forecast = forecast;
      this.relative_humidity = relative_humidity;
      this.wind = wind;
      this.timestamp = timestamp;
    }
  }
  
  export interface ForecastData {
    date: string;
    relativeHumidity: {
      low: number;
      high: number;
    };
    temperature: {
      low: number;
      high: number;
    };
  }
  
  export interface ChartOptions {
    temperatureChart: Highcharts.Options;
    humidityChart: Highcharts.Options;
  }
  