const { main } = require("@popperjs/core");
const apiKeys = process.env.apiKey;
const time = document.querySelector("#time");
const city = document.querySelector("#city");
const cityName = document.querySelector("#city-name");
const mainTemperature = document.querySelector("#temperature");
const wind = document.querySelector("#wind");
const pressure = document.querySelector("#pressure");
const humidity = document.querySelector("#humidity");
const searchSity = document.querySelector("#search-form");
const weekDaysId = [
  "#temperature",
  "#secondDay",
  "#thirdDay",
  "#fourthDay",
  "#fifthDay",
];
const weekDays = document.querySelectorAll(weekDaysId);
const celsius = document.querySelector(".celsius");
const fahrenheit = document.querySelector(".fahrenheit");
const MetricUnitOfMeasurement = "metric";
const weatherIconsClasses = [
  ".mainWeatherIcon",
  ".secondWeatherIcon",
  ".thirdWeatherIcon",
  ".fourthWeatherIcon",
  ".fifthWeatherIcon",
];
let icon = JSON.parse(localStorage.getItem("icon")) || [];
const weatherIcons = document.querySelectorAll(weatherIconsClasses);
const currentDate = new Date();
const currentUTCDate = new Date(
  currentDate.getUTCFullYear(),
  currentDate.getUTCMonth(),
  currentDate.getUTCDate(),
  currentDate.getUTCHours(),
  currentDate.getUTCMinutes()
).getTime();
const options = {
  weekday: "long",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "numeric",
};

window.onload = function () {
  function processWeatherInfoRequest(event) {
    if (event) {
      event.preventDefault();
    }

    let unitsOfMeasurement = localStorage.getItem("unitsOfMeasurement");

    if (!unitsOfMeasurement) {
      unitsOfMeasurement = MetricUnitOfMeasurement;
    }
    let cityForRequest = city.value.trim();
    if (cityForRequest) {
      localStorage.setItem("city", cityForRequest);
    }
    if (!cityForRequest) {
      cityForRequest = localStorage.getItem("city");
    }

    const apiURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityForRequest}&units=${unitsOfMeasurement}`;
    axios.get(`${apiURL}&appid=${apiKeys}`).then(renderTodayWeatherInfoRequest);
  }

  function renderTodayWeatherInfoRequest(apiObj) {
    const weatherArray = apiObj.data.list;

    const avrTempRequest = weatherArray[0].main.temp;
    const windDirectionRequest = weatherArray[0].wind.deg;
    const pressureRequest = weatherArray[0].main.pressure;
    const humidityRequest = weatherArray[0].main.humidity;
    const cityForRequest = localStorage.getItem("city");
    const cityTimezone = apiObj.data.city.timezone * 1000;

    let localTime = new Date(currentUTCDate + cityTimezone);
    const currentLocalTime = localTime.toLocaleDateString("en-GB", options);
    time.innerText = currentLocalTime;
    let windSpeedRequest = weatherArray[0].wind.speed;
    let unitsOfMeasurement = localStorage.getItem("unitsOfMeasurement");
    windSpeedRequest =
      unitsOfMeasurement == "metric"
        ? String(Math.round(windSpeedRequest * 3.6) + " km/h")
        : String(Math.round(windSpeedRequest) + " mil/h");

    let dayNumber = 0;
    deleteOldWeatherIcon(dayNumber);
    for (dayNumber; dayNumber < 5; dayNumber++) {
      iconWeatherRender(dayNumber, apiObj.data, cityTimezone);
      if (dayNumber != 0) {
        renderWeatherInfoOnNextDays(dayNumber, weatherArray);
      }
    }
    windDirection(windDirectionRequest);
    cityName.innerText = cityForRequest;
    mainTemperature.innerText = Math.round(avrTempRequest);
    wind.innerText = `Wind: ${windSpeedRequest}, ${direction} `;
    pressure.innerText = `Pressure: ${pressureRequest} hPa`;
    humidity.innerText = `Humidity: ${humidityRequest}%`;

    city.value = "";
  }

  function renderWeatherInfoOnNextDays(dayNumber, weatherArray) {
    const dayFirst = new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate() + dayNumber
    );
    const daySecond = new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate() + dayNumber + 1
    );
    const options = {
      weekday: "long",
    };
    const day = dayFirst.toLocaleDateString("en-GB", options);
    const unixTimedayFirst = Math.floor(+dayFirst) / 1000;
    const unixTimeSecond = Math.floor(+daySecond) / 1000;
    const oneDayWeatherInfo = weatherArray.filter(
      (item) => item.dt > unixTimedayFirst && item.dt < unixTimeSecond
    );

    let oneDayTemp = [];
    oneDayWeatherInfo.forEach((element) => {
      let result = element.main.temp;
      oneDayTemp.push(result);
    });

    let nightTemp = Math.min.apply(null, oneDayTemp);
    let dayTemp = Math.max.apply(null, oneDayTemp);
    nightTemp = Math.round(nightTemp);
    dayTemp = Math.round(dayTemp);

    let dayText = `${day} <p>${dayTemp}° <span>${nightTemp}°</span></p>`;

    weekDays[dayNumber].innerHTML = dayText;
  }
  function windDirection(wind) {
    direction =
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
        : "North-West";
  }
  function deleteOldWeatherIcon(dayNumber) {
    for (dayNumber; dayNumber < 5; dayNumber++) {
      weatherIcons[dayNumber].classList.remove(icon[0]);
      icon.shift();
    }
  }
  function iconWeatherRender(dayNumber, weatherArray, cityTimezone) {
    const weatherIconRequest = weatherArray.list[dayNumber].weather[0].main;
    let nightHours = currentDate.getHours() + cityTimezone;

    dayNumber == 0 && nightHours > 20 && nightHours < 6
      ? (weatherIcons[dayNumber].classList.add(`night${weatherIconRequest}`),
        icon.push(`night${weatherIconRequest}`))
      : (weatherIcons[dayNumber].classList.add(weatherIconRequest),
        icon.push(`${weatherIconRequest}`));

    localStorage.setItem("icon", JSON.stringify(icon));
  }

  processWeatherInfoRequest();
  searchSity.addEventListener(
    "submit",

    processWeatherInfoRequest
  );

  celsius.addEventListener("click", () => {
    localStorage.setItem("unitsOfMeasurement", MetricUnitOfMeasurement);
    processWeatherInfoRequest(event, MetricUnitOfMeasurement);
    selectDegree();
  });
  fahrenheit.addEventListener("click", () => {
    const MetricUnitOfMeasurement = "imperial";
    localStorage.setItem("unitsOfMeasurement", MetricUnitOfMeasurement);

    processWeatherInfoRequest(event, MetricUnitOfMeasurement);
    selectDegree();
  });
  selectDegree();
  function selectDegree() {
    let unitsOfMeasurement = localStorage.getItem("unitsOfMeasurement");
    if (unitsOfMeasurement) {
      if (unitsOfMeasurement == "metric") {
        fahrenheit.classList.remove("_active");
        celsius.classList.add("_active");
      }
      if (unitsOfMeasurement == "imperial") {
        celsius.classList.remove("_active");
        fahrenheit.classList.add("_active");
      }
    }
    if (!unitsOfMeasurement) {
      celsius.classList.add("_active");
    }
  }
};
