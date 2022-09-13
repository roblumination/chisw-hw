import WeatherWidgetConnector from "./WeatherWidgetConnector.js";
import WeatherWidgetLayout from "./WeatherWidgetLayout.js";

export default class WeatherWidget {
  layout: WeatherWidgetLayout;
  connector: WeatherWidgetConnector = new WeatherWidgetConnector();

  constructor(el: HTMLElement) {
    this.layout = new WeatherWidgetLayout(el, () =>
      this.handleLocationButton()
    );
    this.update();
  }

  public async update() {
    this.layout.showLoader();
    const weatherData = await this.connector.loadWeatherData();
    this.layout.setData(weatherData);
    this.layout.hideLoader();
  }

  public getLocation() {
    return new Promise<GeolocationPosition>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => resolve(pos));
      } else {
        alert("Not avaliable on your device.");
      }
    });
  }

  setCity(cityName: string) {
    this.connector.setCity(cityName);
    this.update();
  }

  private async handleLocationButton() {
    const position = await this.getLocation();
    this.connector.updateLocation(position);
    this.update();
  }
}
