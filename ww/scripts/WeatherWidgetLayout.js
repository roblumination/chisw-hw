import { convertHPaToMmHg, getXYFromDeg, roundToSpaces } from "./utils.js";

export default class WeatherWidgetLayout {
  #data;
  #graphix;

  constructor(mainEl, buttonLocationHandler) {
    this.mainEl;
    this.#data = {};
    this.#graphix = {};

    this.#initMainElement(mainEl);
    this.#initStyles("./ww/styles/weather.css");
    this.#initLayout();
    this.#initDOMElements();
    this.#graphix.buttonlocation.addEventListener("click", () =>
      buttonLocationHandler()
    );
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
    setVal("temp", Math.round(data.main.temp));
    setVal("humidity", data.main.humidity);
    setVal("pressure", convertHPaToMmHg(data.main.pressure));
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

  #calcWindVectors(deg) {
    const [x, y] = getXYFromDeg(deg);
    return [roundToSpaces(x, 2), roundToSpaces(y, 2)];
  }
}
