const { main } = require("@popperjs/core");

window.onload = function () {
  const apiKeys = process.env.apiKey;
  const time = document.querySelector("#time");
  const city = document.querySelector("#city");
  const cityName = document.querySelector("#city-name");
  const mainTemperature = document.querySelector("#temperature");
  const wind = document.querySelector("#wind");
  const pressure = document.querySelector("#pressure");
  const humidity = document.querySelector("#humidity");
  const searchSity = document.querySelector("#search-form");
  const secondDay = document.querySelector("#secondDay");
  const thirdDay = document.querySelector("#thirdDay");
  const fourthDay = document.querySelector("#fourthDay");
  const fifthDay = document.querySelector("#fifthDay");
  const celsius = document.querySelector(".celsius");
  const fahrenheit = document.querySelector(".fahrenheit");
  const mainWeatherIcon = document.querySelector(".mainWeatherIcon");
  const secondWeatherIcon = document.querySelector(".secondWeatherIcon");
  const thirdWeatherIcon = document.querySelector(".thirdWeatherIcon");
  const fourthWeatherIcon = document.querySelector(".fourthWeatherIcon");
  const fifthWeatherIcon = document.querySelector(".fifthWeatherIcon");
  const currentDate = new Date();
  const MetricUnitOfMeasurement = "metric";

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
    let unitsOfMeasurement = localStorage.getItem("unitsOfMeasurement");
    if (!unitsOfMeasurement) {
      unitsOfMeasurement = MetricUnitOfMeasurement;
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
    let windSpeedRequest = weatherArray[0].wind.speed;
    iconWeatherRender(0, weatherArray);
    let unitsOfMeasurement = localStorage.getItem("unitsOfMeasurement");
    windSpeedRequest =
      unitsOfMeasurement == "metric"
        ? String(Math.round(windSpeedRequest * 3.6) + " km/h")
        : String(Math.round(windSpeedRequest) + " mil/h");

    time.innerText = currentTime;
    let dayNumber = 1;
    for (dayNumber; dayNumber < 5; dayNumber++) {
      console.log(dayNumber);
      iconWeatherRender(dayNumber, weatherArray);
      renderWeatherInfoOnNextDays(dayNumber, weatherArray);
    }
    windDirection(windDirectionRequest);
    cityName.innerText = cityForRequest;
    mainTemperature.innerText = Math.round(avrTempRequest);
    wind.innerText = `Wind: ${windSpeedRequest}, ${direction} `;
    pressure.innerText = `Pressure: ${pressureRequest}`;
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

      Math.max(element.main.temp);
    });
    let oneDayTempNight = oneDayTemp.splice(0, 4);
    oneDayTempDay = oneDayTemp;
    let nightTemp = Math.min.apply(null, oneDayTempNight);
    let dayTemp = Math.max.apply(null, oneDayTempDay);
    nightTemp = Math.round(nightTemp);
    dayTemp = Math.round(dayTemp);
    let dayText = `${day} \n ${dayTemp}° ${nightTemp}°  `;
    dayNumber === 1
      ? (secondDay.innerText = dayText)
      : dayNumber === 2
      ? (thirdDay.innerText = dayText)
      : dayNumber === 3
      ? (fourthDay.innerText = dayText)
      : dayNumber === 4
      ? (fifthDay.innerText = dayText)
      : console.log("error");
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
  function iconWeatherRender(dayNumber, weatherArray) {
    console.log(weatherArray[dayNumber].weather[0].main);
    let weatherIconRequest = weatherArray[dayNumber].weather[0].main;
    switch (dayNumber) {
      case 0:
        mainWeatherIcon.classList.add(weatherIconRequest);
      case 1:
        secondWeatherIcon.classList.add(weatherIconRequest);
      case 2:
        thirdWeatherIcon.classList.add(weatherIconRequest);
      case 3:
        fourthWeatherIcon.classList.add(weatherIconRequest);
      case 4:
        fifthWeatherIcon.classList.add(weatherIconRequest);
    }
    // renderMainWeatherIcon;
    // renderWeatherIcon =
    //   weatherIconRequest == "Clouds"
    //     ? mainWeatherIcon.classList.add("Clouds")
    //     : "no";
  }

  processWeatherInfoRequest();
  searchSity.addEventListener("submit", processWeatherInfoRequest);
  celsius.addEventListener("click", (e) => {
    if (e.target.className == "celsius") {
      const unitsOfMeasurement = "metric";
      localStorage.setItem("unitsOfMeasurement", unitsOfMeasurement);

      processWeatherInfoRequest(event, unitsOfMeasurement);
    }
  });
  fahrenheit.addEventListener("click", (e) => {
    if (e.target.className == "fahrenheit") {
      const unitsOfMeasurement = "imperial";
      localStorage.setItem("unitsOfMeasurement", unitsOfMeasurement);
      processWeatherInfoRequest(event, unitsOfMeasurement);
    }
  });
};
