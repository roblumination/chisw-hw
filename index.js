import WeatherWidget from "./ww/scripts/WeatherWidget.js";

const weatherWidget = new WeatherWidget(
  document.getElementById("weather-widget")
);

const container = document.querySelector(".super-buttons");
container.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () =>
    weatherWidget.setCity(button.innerText)
  );
});
