import WeatherWidget from "./ww/scripts/WeatherWidget.js";
const weatherElement = document.getElementById("weather-widget");
if (!weatherElement) throw new Error();
const weatherWidget = new WeatherWidget(weatherElement);
const container = document.querySelector(".super-buttons");
if (container) {
  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () =>
      weatherWidget.setCity(button.innerText)
    );
  });
}
