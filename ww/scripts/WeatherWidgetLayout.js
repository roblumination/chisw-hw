import { convertHPaToMmHg, getXYFromDeg, roundToSpaces } from "./utils.js";
export default class WeatherWidgetLayout {
    constructor(mainEl, buttonLocationHandler) {
        this.mainEl = mainEl;
        this.initLayout();
        this.graphixElements = this.getGraphixElements();
        this.dataElements = this.getDataElements();
        console.log(this.dataElements);
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
        // console.log(this.mainEl.querySelector("#weather-value-temp"));
        // console.log(document.querySelector("#weather-value-temp"));
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
    setLoaderState(isLoading) {
        if (this.graphixElements.loader) {
            this.graphixElements.loader.style.opacity = isLoading ? "1" : "0";
        }
    }
    setData(responseData) {
        // console.log(this.dataElements);
        // console.log(this.graphixElements);
        const setElementText = (name, value) => {
            const key = name;
            console.log(this.dataElements[key], key);
            if (this.dataElements[key] !== null) {
                // console.log(value);
                this.dataElements[key].innerText = value;
            }
        };
        console.log(responseData);
        setElementText("humidity", responseData.main.humidity.toString());
        setElementText("temp", Math.round(responseData.main.temp).toString());
        setElementText("pressure", convertHPaToMmHg(responseData.main.pressure).toString());
        setElementText("tempFeelsLike", Math.round(responseData.main.feels_like).toString());
        setElementText("cityName", responseData.name);
        this.setWind(responseData.wind.deg, responseData.wind.speed);
        this.setIco(responseData.weather[0].icon);
        const windSpeed = responseData.wind.speed > 1
            ? Math.round(responseData.wind.speed)
            : Math.round(responseData.wind.speed * 10) / 10;
        setElementText("windSpeed", windSpeed.toString());
    }
    setWind(deg, stength) {
        const [x, y] = this.calcWindVectors(deg).map((v) => v * 1000 * stength);
        this.setWindCloudSpeed(-x, y);
        if (this.graphixElements.arrow)
            this.graphixElements.arrow.style.transform = `rotate(${deg}deg)`;
    }
    setIco(code) {
        if (this.graphixElements.ico)
            this.graphixElements.ico.src = `http://openweathermap.org/img/wn/${code}@2x.png`;
    }
    setWindCloudSpeed(x, y) {
        document.documentElement.style.setProperty("--weather-widget-windspeed-x", x + "px");
        document.documentElement.style.setProperty("--weather-widget-windspeed-y", y + "px");
    }
    calcWindVectors(deg) {
        const [x, y] = getXYFromDeg(deg);
        return [roundToSpaces(x, 2), roundToSpaces(y, 2)];
    }
}
