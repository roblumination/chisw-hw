const OpenWeatherAPIKey = "4322a85eea73487e8dcc8898fada9876";
export default class WeatherWidgetConnector {
    constructor() {
        this.DEFAULT_LOCATION = [50.4333, 30.5167];
        this.queryParam = {
            apiKey: OpenWeatherAPIKey,
            coord: this.DEFAULT_LOCATION,
            language: "ua",
        };
    }
    loadWeatherData() {
        return new Promise((resolve, reject) => {
            fetch(this.getRequestLine())
                .then((response) => response.json())
                .then((response) => {
                resolve(response);
            })
                .catch((reason) => reject(reason));
        });
    }
    updateLocation(position) {
        if (this.queryParam.city)
            delete this.queryParam.city;
        this.queryParam.coord = [
            position.coords.latitude,
            position.coords.longitude,
        ];
    }
    setCity(city) {
        this.queryParam.city = city;
    }
    getRequestLine() {
        const base = "https://api.openweathermap.org/data/2.5/weather";
        const query = [
            `lat=${this.queryParam.coord[0]}`,
            `lon=${this.queryParam.coord[1]}`,
            this.queryParam.city == null ? "" : `q=${this.queryParam.city}`,
            `appid=${this.queryParam.apiKey}`,
            "units=metric",
            `lang=${this.queryParam.language}`,
        ];
        return base + "?" + query.join("&");
    }
}
