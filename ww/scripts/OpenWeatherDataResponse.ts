export default interface OpenWeatherDataResponse {
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
  };
  name: string;
  weather: Array<IWeatherData>;
  wind: {
    deg: number;
    gust: number;
    speed: number;
  };
}

interface IWeatherData {
  description: string;
  icon: string;
  id: number;
  main: string;
}
