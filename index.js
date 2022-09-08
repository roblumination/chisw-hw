class WeatherWidgetLayout {
  #data;
  #graphix;

  constructor(mainEl, buttonLocationHandler) {
    this.mainEl;
    this.#data = {};
    this.#graphix = {};

    this.#initMainElement(mainEl);
    this.#initStyles("./weather.css");
    this.#initLayout();
    this.#initDOMElements();
    this.#graphix.buttonlocation.addEventListener("click", () =>
      buttonLocationHandler()
    );
    // this.temperature =
  }

  #initMainElement(mainEl) {
    if (!mainEl)
      throw new Error("Can't init Weather Widget. Element not exist");
    this.mainEl = mainEl;
    mainEl.classList.add("ww");
  }

  #initStyles(path) {
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", path);
    document.head.appendChild(link);
  }

  #initLayout() {
    const base = `<div class="ww__loader" id="weather-loader">Loading...</div><div class="ww__left ww__section">
      <div class="ww__temp">
        <img class="ww__temp__ico" id="weather-value-icon" src="http://openweathermap.org/img/wn/10d@2x.png"></img>
        <div class="ww__temp__value"><span id="weather-value-temp">0</span>°C</div>
        <div class="ww__temp__feels">FEELS LIKE: <span id="weather-value-feels">0</span>°C</div>
      </div>
      <div class="ww__city">
        <div class="ww__city__name">in <span id="weather-value-city">City</span></div>
        <button class="ww__city__change" id="weather-button-city">detect</button>
      </div>
    </div>
    <div class="ww__right ww__section">
      <div class="ww__data">
        <div>Pressure:</div>
        <div><span id="weather-value-pressure">0</span> mmhg</div>
        <div>Humidity:</div>
        <div><span id="weather-value-humidity">0</span>%</div>
        <div>Wind:</div>
        <div><span id="weather-value-wind-speed">0</span>m/s</div>
      </div>
      <div class="ww__graph">
        <div class="ww__graph__cloud ww__graph__cloud2"></div>
        <div class="ww__graph__cloud ww__graph__cloudM"></div>
        <div class="ww__graph__cloud ww__graph__cloud1"></div>
        <div class="ww__graph__cloud ww__graph__cloudT"></div>
        <div class="ww__graph__nswe">
          <div class="ww__graph__nswe__arrow" id="weather-wind-arrow"></div>
        </div>
      </div>
    </div>`;

    this.mainEl.innerHTML = base;
  }

  #initDOMElements() {
    this.#graphix = {
      loader: this.mainEl.querySelector("#weather-loader"),
      buttonlocation: this.mainEl.querySelector("#weather-button-city"),
      ico: this.mainEl.querySelector("#weather-value-icon"),
      arrow: this.mainEl.querySelector("#weather-wind-arrow"),
    };
    this.#data = {
      temp: this.mainEl.querySelector("#weather-value-temp"),
      tempFeelsLike: this.mainEl.querySelector("#weather-value-feels"),
      cityName: this.mainEl.querySelector("#weather-value-city"),
      pressure: this.mainEl.querySelector("#weather-value-pressure"),
      humidity: this.mainEl.querySelector("#weather-value-humidity"),
      windSpeed: this.mainEl.querySelector("#weather-value-wind-speed"),
    };
  }

  setLoaderState(isLoading) {
    this.#graphix.loader.style.opacity = isLoading ? 1 : 0;
  }

  setData(data) {
    const setVal = (field, data) => (this.#data[field].innerText = data);
    console.log(data);
    // this.#data.temp.innerText = data.main.temp;
    setVal("temp", Math.round(data.main.temp));
    setVal("humidity", data.main.humidity);
    setVal("pressure", this.#getPressureInMmHg(data.main.pressure));
    setVal("tempFeelsLike", Math.round(data.main.feels_like));
    setVal("cityName", data.name);
    this.setWind(data.wind.deg, data.wind.speed);
    this.setIco(data.weather[0].icon);
    const windSpeed =
      data.wind.speed > 1
        ? Math.round(data.wind.speed)
        : Math.round(data.wind.speed * 10) / 10;
    setVal("windSpeed", windSpeed);
  }

  setWind(deg, stength) {
    const [x, y] = this.#calcWindVectors(deg).map((v) => v * 1000 * stength);
    this.#setWindCloudSpeed(-x, y);
    this.#graphix.arrow.style.transform = `rotate(${deg}deg)`;
  }

  setIco(code) {
    this.#graphix.ico.src = `http://openweathermap.org/img/wn/${code}@2x.png`;
  }

  #setWindCloudSpeed(x, y) {
    document.documentElement.style.setProperty(
      "--weather-widget-windspeed-x",
      x + "px"
    );
    document.documentElement.style.setProperty(
      "--weather-widget-windspeed-y",
      y + "px"
    );
  }

  #getPressureInMmHg(pressureInHPa) {
    return ~~(pressureInHPa / 1.3332239);
  }

  #calcWindVectors(deg) {
    const round = (val) => Math.round(val * 100) / 100;
    const degToRad = (deg) => (deg * Math.PI) / 180;

    const [x, y] = [Math.sin(degToRad(deg)), Math.cos(degToRad(deg))];
    return [round(x), round(y)];
  }
}

class WeatherWidgetConnector {
  constructor() {
    this.queryParam = {
      apiKey: "4322a85eea73487e8dcc8898fada9876",
      coord: [50.4333, 30.5167],
      lang: "ua",
      city: null,
    };
  }

  loadWeatherData() {
    return new Promise((resolve, reject) => {
      fetch(this.#getRequestLine())
        .then((response) => response.json())
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason));
    });
  }

  updateLocation(position) {
    if (this.queryParam.city) delete this.queryParam.city;
    this.queryParam.coord = [
      position.coords.latitude,
      position.coords.longitude,
    ];
  }

  setCity(city) {
    this.queryParam.city = city;
  }

  #getRequestLine() {
    const base = "https://api.openweathermap.org/data/2.5/weather";
    const query = [
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

class WeatherWidget {
  constructor(el) {
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

const weatherWidget = new WeatherWidget(
  document.getElementById("weather-widget")
);

const container = document.querySelector(".super-buttons");
container.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () =>
    weatherWidget.setCity(button.innerText)
  );
});
