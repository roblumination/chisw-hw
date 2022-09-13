import { convertHPaToMmHg, getXYFromDeg, roundToSpaces } from "./utils.js";
export default class WeatherWidgetLayout {
    constructor(mainEl, buttonLocationHandler) {
        this.WIND_SPEED_MULTIPLIER = 1000;
        this.mainEl = mainEl;
        this.initLayout();
        this.graphixElements = this.getGraphixElements();
        this.dataElements = this.getDataElements();
        this.init(buttonLocationHandler);
    }
    init(handler) {
        this.initMainElement();
        this.initStyles("./ww/styles/weather.css");
        if (this.graphixElements.buttonLocation) {
            this.graphixElements.buttonLocation.addEventListener("click", () => handler());
        }
    }
    initMainElement() {
        this.mainEl.classList.add("ww");
    }
    getGraphixElements() {
        return {
            loader: this.mainEl.querySelector("#weather-loader"),
            buttonLocation: this.mainEl.querySelector("#weather-button-city"),
            ico: this.mainEl.querySelector("#weather-value-icon"),
            arrow: this.mainEl.querySelector("#weather-wind-arrow"),
        };
    }
    getDataElements() {
        return {
            temp: this.mainEl.querySelector("#weather-value-temp"),
            tempFeelsLike: this.mainEl.querySelector("#weather-value-feels"),
            cityName: this.mainEl.querySelector("#weather-value-city"),
            pressure: this.mainEl.querySelector("#weather-value-pressure"),
            humidity: this.mainEl.querySelector("#weather-value-humidity"),
            windSpeed: this.mainEl.querySelector("#weather-value-wind-speed"),
        };
    }
    initStyles(path) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", path);
        document.head.appendChild(link);
    }
    initLayout() {
        const base = `
    <div class="ww__loader" id="weather-loader">Loading...</div><div class="ww__left ww__section">
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
    showLoader() {
        this.setLoaderState(true);
    }
    hideLoader() {
        this.setLoaderState(false);
    }
    setLoaderState(isLoading) {
        if (this.graphixElements.loader) {
            this.graphixElements.loader.style.opacity = isLoading ? "1" : "0";
        }
    }
    setElementText(name, value) {
        const key = name;
        if (this.dataElements[key] !== null) {
            this.dataElements[key].innerText = value.toString();
        }
    }
    setData(responseData) {
        const windSpeed = responseData.wind.speed > 1
            ? Math.round(responseData.wind.speed)
            : roundToSpaces(responseData.wind.speed, 1);
        const pressure = convertHPaToMmHg(responseData.main.pressure);
        const tempFeelsLike = Math.round(responseData.main.feels_like);
        this.setElementText("humidity", responseData.main.humidity);
        this.setElementText("temp", Math.round(responseData.main.temp));
        this.setElementText("pressure", pressure);
        this.setElementText("tempFeelsLike", tempFeelsLike);
        this.setElementText("cityName", responseData.name);
        this.setElementText("windSpeed", windSpeed);
        this.setWind(responseData.wind.deg, responseData.wind.speed);
        this.setIco(responseData.weather[0].icon);
    }
    setWind(deg, stength) {
        const [x, y] = this.getWindVectorProjections(deg).map((vectorProjection) => vectorProjection * stength * this.WIND_SPEED_MULTIPLIER);
        this.setWindCloudSpeed(-x, y);
        if (this.graphixElements.arrow)
            this.graphixElements.arrow.style.transform = `rotate(${deg}deg)`;
    }
    setIco(imageCode) {
        const path = `http://openweathermap.org/img/wn/${imageCode}@2x.png`;
        if (this.graphixElements.ico)
            this.graphixElements.ico.src = path;
    }
    setWindCloudSpeed(x, y) {
        const varTemplate = "--weather-widget-windspeed-";
        document.documentElement.style.setProperty(varTemplate + "x", x + "px");
        document.documentElement.style.setProperty(varTemplate + "y", y + "px");
    }
    getWindVectorProjections(deg) {
        const [x, y] = getXYFromDeg(deg);
        return [roundToSpaces(x, 2), roundToSpaces(y, 2)];
    }
}
