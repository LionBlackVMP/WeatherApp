window.onload = function () {
  const time = document.querySelector("#time");
  const city = document.querySelector("#city");
  const cityName = document.querySelector("#city-name");
  const mainTemperature = document.querySelector("#temperature");
  const wind = document.querySelector("#wind");
  const pressure = document.querySelector("#pressure");
  const humidity = document.querySelector("#humidity");
  const searchSity = document.querySelector("#search-form");
  const currentDate = new Date();
  console.log("t");
  const options = {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "numeric",
  };
  const currentTime = currentDate.toLocaleDateString("en-GB", options);

  function processWeatherInfoRequest(event) {
    if (event) {
      event.preventDefault();
    }
    let cityForRequest = city.value.trim();

    if (cityForRequest) {
      let cityForRequestLetterCase =
        cityForRequest[0].toUpperCase() + cityForRequest.slice(1).toLowerCase();

      localStorage.setItem("city", cityForRequestLetterCase);
    }
    if (!cityForRequest) {
      cityForRequest = localStorage.getItem("city");
    }

    const apiKeys = process.env.apiKey;
    console.log(apiKeys);
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityForRequest}&units=metric`;
    axios.get(`${apiURL}&appid=${apiKeys}`).then(renderWeatherInfoRequest);
  }
  function renderWeatherInfoRequest(apiObj) {
    const avrTempRequest = apiObj.data.main.temp;
    const windSpeedRequest = apiObj.data.wind.speed;
    const windDirectionRequest = apiObj.data.wind.deg;
    const pressureRequest = apiObj.data.main.pressure;
    const humidityRequest = apiObj.data.main.humidity;
    let cityForRequest = localStorage.getItem("city");
    windDirection(windDirectionRequest);
    time.innerText = currentTime;
    cityName.innerText = cityForRequest;
    mainTemperature.innerText = Math.round(avrTempRequest);
    wind.innerText = `Wind: ${Math.round(
      windSpeedRequest
    )} km/h, ${direction} `;
    pressure.innerText = `Pressure: ${pressureRequest}`;
    humidity.innerText = `Humidity: ${humidityRequest}%`;

    city.value = "";
    console.log(humidityRequest);
    console.log(apiObj.data);
  }
  function windDirection(wind) {
    return (direction =
      (wind >= 338 && wind <= 360) || (wind >= 0 && wind < 23)
        ? "North"
        : wind >= 23 && wind < 68
        ? "North-East"
        : wind >= 68 && wind < 113
        ? "East"
        : wind >= 113 && wind < 158
        ? "South-East"
        : wind >= 158 && wind < 203
        ? "South"
        : wind >= 203 && wind < 248
        ? "South-West"
        : wind >= 248 && wind < 293
        ? "West"
        : "North-West");
  }
  processWeatherInfoRequest();
  searchSity.addEventListener("submit", processWeatherInfoRequest);
};
