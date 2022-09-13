var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import WeatherWidgetConnector from "./WeatherWidgetConnector.js";
import WeatherWidgetLayout from "./WeatherWidgetLayout.js";
export default class WeatherWidget {
    constructor(el) {
        this.connector = new WeatherWidgetConnector();
        this.layout = new WeatherWidgetLayout(el, () => this.handleLocationButton());
        this.update();
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            this.layout.showLoader();
            const weatherData = yield this.connector.loadWeatherData();
            this.layout.setData(weatherData);
            this.layout.hideLoader();
        });
    }
    getLocation() {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => resolve(pos));
            }
            else {
                alert("Not avaliable on your device.");
            }
        });
    }
    setCity(cityName) {
        this.connector.setCity(cityName);
        this.update();
    }
    handleLocationButton() {
        return __awaiter(this, void 0, void 0, function* () {
            const position = yield this.getLocation();
            this.connector.updateLocation(position);
            this.update();
        });
    }
}
