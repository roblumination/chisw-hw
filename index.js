class WeatherWidgetLayout {
  constructor(mainEl, buttonLocationHandler) {
    this.mainEl = mainEl;
    this.locationButton = mainEl.querySelector("#detect-location");
    this.locationButton.addEventListener("click", () =>
      buttonLocationHandler()
    );
    // this.temperature =
  }

  checkMainEl() {}
}

class WeatherWidgetConnector {
  constructor() {
    this.queryParam = {
      apiKey: "4322a85eea73487e8dcc8898fada9876",
      coord: [50.4333, 30.5167],
      lang: "ua",
    };
  }

  loadWeatherData() {
    return new Promise((resolve, reject) => {
      fetch(this.#getRequestLine())
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((reason) => reject(reason));
    });
  }

  updateLocation(position) {
    this.queryParam.coord = [
      position.coords.latitude,
      position.coords.longitude,
    ];
  }

  #getRequestLine() {
    const base = "https://api.openweathermap.org/data/2.5/weather";
    const query = [
      `lat=${this.queryParam.coord[0]}`,
      `lon=${this.queryParam.coord[1]}`,
      // "q=Kyiv",
      `appid=${this.queryParam.apiKey}`,
      "units=metric",
      `lang=${this.queryParam.lang}`,
    ];
    return base + "?" + query.join("&");
  }
}

class WeatherWidget {
  constructor(el) {
    // this.layout = new WeatherWidgetLayout(el, () =>
    //   this.#handleLocationButton()
    // );
    // this.connector = new WeatherWidgetConnector();
    // this.connector.loadWeatherData();
  }

  update() {
    this.connector.loadWeatherData().then((data) => {});
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

  #handleLocationButton() {
    this.getLocation().then((r) => {
      this.connector.updateLocation(r);
      this.update();
    });
  }

  getPressureInMmHg(pressureInHPa) {
    return pressureInHPa / 1.3332239;
  }
}

const weatherWidget = new WeatherWidget(document.getElementById("weather"));
