import IOpenWeatherDataResponse from "./IOpenWeatherDataResponse.js";
const OpenWeatherAPIKey: string = "4322a85eea73487e8dcc8898fada9876";

interface IQueryParams {
  apiKey: string;
  coord: [number, number];
  lang: string;
  city?: string;
}

export default class WeatherWidgetConnector {
  queryParam: IQueryParams;

  constructor() {
    this.queryParam = {
      apiKey: OpenWeatherAPIKey,
      coord: [50.4333, 30.5167],
      lang: "ua",
    };
  }

  public loadWeatherData(): Promise<IOpenWeatherDataResponse> {
    return new Promise((resolve, reject) => {
      fetch(this.getRequestLine())
        .then((response) => response.json())
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason));
    });
  }

  public updateLocation(position: GeolocationPosition) {
    if (this.queryParam.city) delete this.queryParam.city;
    this.queryParam.coord = [
      position.coords.latitude,
      position.coords.longitude,
    ];
  }

  public setCity(city: string) {
    this.queryParam.city = city;
  }

  private getRequestLine(): string {
    const base: string = "https://api.openweathermap.org/data/2.5/weather";
    const query: Array<string> = [
      `lat=${this.queryParam.coord[0]}`,
      `lon=${this.queryParam.coord[1]}`,
      this.queryParam.city == null ? "" : `q=${this.queryParam.city}`,
      `appid=${this.queryParam.apiKey}`,
      "units=metric",
      `lang=${this.queryParam.lang}`,
    ];
    return base + "?" + query.join("&");
  }
}
