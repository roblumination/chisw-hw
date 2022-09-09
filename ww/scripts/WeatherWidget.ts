import WeatherWidgetConnector from "./WeatherWidgetConnector.ts";
import WeatherWidgetLayout from "./WeatherWidgetLayout.ts";

export default class WeatherWidget {
  constructor(el: HTMLElement) {
    this.layout = new WeatherWidgetLayout(el, () =>
      this.#handleLocationButton()
    );
    this.connector = new WeatherWidgetConnector();
    this.connector.loadWeatherData().then((data) => {
      this.layout.setLoaderState(false);
      this.layout.setData(data);
    });
  }

  update() {
    this.layout.setLoaderState(true);
    this.connector.loadWeatherData().then((data) => {
      this.layout.setData(data);
      this.layout.setLoaderState(false);
    });
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => resolve(pos));
      } else {
        alert("Not avaliable on your device.");
      }
    });
  }

  setCity(cityName) {
    this.connector.setCity(cityName);
    this.update();
  }

  #handleLocationButton() {
    this.getLocation().then((r) => {
      this.connector.updateLocation(r);
      this.update();
    });
  }
}
