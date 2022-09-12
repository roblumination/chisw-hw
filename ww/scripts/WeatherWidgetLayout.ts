import IOpenWeatherDataResponse from "./IOpenWeatherDataResponse.js";
import { convertHPaToMmHg, getXYFromDeg, roundToSpaces } from "./utils.js";

interface ILayoutDataElements {
  temp: HTMLElement | null;
  tempFeelsLike: HTMLElement | null;
  pressure: HTMLElement | null;
  humidity: HTMLElement | null;
  windSpeed: HTMLElement | null;
  cityName: HTMLElement | null;
}

interface ILayoutGraphixElements {
  loader: HTMLElement | null;
  buttonLocation: HTMLElement | null;
  ico: HTMLImageElement | null;
  arrow: HTMLElement | null;
}

export default class WeatherWidgetLayout {
  private dataElements: ILayoutDataElements;
  private graphixElements: ILayoutGraphixElements;
  private mainEl: HTMLElement;

  constructor(mainEl: HTMLElement, buttonLocationHandler: Function) {
    this.mainEl = mainEl;
    this.graphixElements = this.getGraphixElements();
    this.dataElements = this.getDataElements();
    this.init(buttonLocationHandler);
  }

  private init(handler: Function) {
    this.initMainElement();
    this.initStyles("./ww/styles/weather.css");
    this.initLayout();
    if (this.graphixElements.buttonLocation) {
      this.graphixElements.buttonLocation.addEventListener("click", () =>
        handler()
      );
    }
  }

  private initMainElement() {
    this.mainEl.classList.add("ww");
  }

  private getGraphixElements(): ILayoutGraphixElements {
    return {
      loader: this.mainEl.querySelector<HTMLElement>("#weather-button-city"),
      buttonLocation: this.mainEl.querySelector<HTMLElement>(
        "#weather-button-city"
      ),
      ico: this.mainEl.querySelector<HTMLImageElement>("#weather-value-icon"),
      arrow: this.mainEl.querySelector<HTMLElement>("#weather-wind-arrow"),
    };
  }

  private getDataElements(): ILayoutDataElements {
    console.log(this.mainEl.querySelector("#weather-value-temp"));
    console.log(this.mainEl);
    return {
      temp: this.mainEl.querySelector<HTMLElement>("#weather-value-temp"),
      tempFeelsLike: this.mainEl.querySelector<HTMLElement>(
        "#weather-value-feels"
      ),
      cityName: this.mainEl.querySelector<HTMLElement>("#weather-value-city"),
      pressure: this.mainEl.querySelector<HTMLElement>(
        "#weather-value-pressure"
      ),
      humidity: this.mainEl.querySelector<HTMLElement>(
        "#weather-value-humidity"
      ),
      windSpeed: this.mainEl.querySelector<HTMLElement>(
        "#weather-value-wind-speed"
      ),
    };
  }

  private initStyles(path: string) {
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", path);
    document.head.appendChild(link);
  }

  private initLayout(): void {
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

  setLoaderState(isLoading: boolean) {
    if (this.graphixElements.loader) {
      this.graphixElements.loader.style.opacity = isLoading ? "1" : "0";
    }
  }

  setData(responseData: IOpenWeatherDataResponse) {
    type DataField = keyof typeof this.dataElements;

    // console.log(this.dataElements);
    // console.log(this.graphixElements);

    const setElementText = (name: string, value: string): void => {
      const key = name as DataField;
      // console.log(this.dataElements[key], key);
      if (this.dataElements[key] !== null) {
        // console.log(value);
        this.dataElements[key]!.innerText = value;
      }
    };

    console.log(responseData);
    setElementText("humidity", responseData.main.humidity.toString());
    setElementText("temp", Math.round(responseData.main.temp).toString());
    setElementText(
      "pressure",
      convertHPaToMmHg(responseData.main.pressure).toString()
    );
    setElementText(
      "tempFeelsLike",
      Math.round(responseData.main.feels_like).toString()
    );
    setElementText("cityName", responseData.name);
    this.setWind(responseData.wind.deg, responseData.wind.speed);
    this.setIco(responseData.weather[0].icon);
    const windSpeed =
      responseData.wind.speed > 1
        ? Math.round(responseData.wind.speed)
        : Math.round(responseData.wind.speed * 10) / 10;
    setElementText("windSpeed", windSpeed.toString());
  }

  setWind(deg: number, stength: number) {
    const [x, y] = this.calcWindVectors(deg).map((v) => v * 1000 * stength);
    this.setWindCloudSpeed(-x, y);
    if (this.graphixElements.arrow)
      this.graphixElements.arrow.style.transform = `rotate(${deg}deg)`;
  }

  setIco(code: string) {
    if (this.graphixElements.ico)
      this.graphixElements.ico.src = `http://openweathermap.org/img/wn/${code}@2x.png`;
  }

  private setWindCloudSpeed(x: number, y: number) {
    document.documentElement.style.setProperty(
      "--weather-widget-windspeed-x",
      x + "px"
    );
    document.documentElement.style.setProperty(
      "--weather-widget-windspeed-y",
      y + "px"
    );
  }

  private calcWindVectors(deg: number) {
    const [x, y] = getXYFromDeg(deg);
    return [roundToSpaces(x, 2), roundToSpaces(y, 2)];
  }
}
