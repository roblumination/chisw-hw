var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WeatherWidget_instances, _WeatherWidget_handleLocationButton;
import WeatherWidgetConnector from "./WeatherWidgetConnector.js";
import WeatherWidgetLayout from "./WeatherWidgetLayout.js";
export default class WeatherWidget {
    constructor(el) {
        _WeatherWidget_instances.add(this);
        this.layout = new WeatherWidgetLayout(el, () => __classPrivateFieldGet(this, _WeatherWidget_instances, "m", _WeatherWidget_handleLocationButton).call(this));
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
}
_WeatherWidget_instances = new WeakSet(), _WeatherWidget_handleLocationButton = function _WeatherWidget_handleLocationButton() {
    this.getLocation().then((r) => {
        this.connector.updateLocation(r);
        this.update();
    });
};
