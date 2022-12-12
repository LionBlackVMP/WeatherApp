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

    const apiURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityForRequest}&units=metric`;
    axios.get(`${apiURL}&appid=${apiKeys}`).then(renderWeatherInfoRequest);
  }
  function renderWeatherInfoRequest(apiObj) {
    console.log(apiObj.data.list);
    console.log(currentDate);

    tomorrowWeather(apiObj);

    time.innerText = currentTime;
    const weatherArray = apiObj.data.list;
    console.log(weatherArray[0]);
    const avrTempRequest = weatherArray[0].main.temp;
    const windSpeedRequest = weatherArray[0].wind.speed;
    const windDirectionRequest = weatherArray[0].wind.deg;
    const pressureRequest = weatherArray[0].main.pressure;
    const humidityRequest = weatherArray[0].main.humidity;
    const cityForRequest = localStorage.getItem("city");
    windDirection(windDirectionRequest);
    cityName.innerText = cityForRequest;
    mainTemperature.innerText = Math.round(avrTempRequest);
    wind.innerText = `Wind: ${Math.round(
      windSpeedRequest
    )} km/h, ${direction} `;
    pressure.innerText = `Pressure: ${pressureRequest}`;
    humidity.innerText = `Humidity: ${humidityRequest}%`;

    city.value = "";
  }
  function tomorrowWeather(apiObj) {
    const weatherArray = apiObj.data.list;
    let tomorrow = new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate() + 1
    );
    let afterTomorrow = new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate() + 2
    );
    let unixTimeTomorrow = Math.floor(+tomorrow) / 1000;
    let unixTimeAfterTomorrow = Math.floor(+afterTomorrow) / 1000;

    let tomorrowDayWeatherArray = weatherArray.filter(
      (item) => item.dt > unixTimeTomorrow && item.dt < unixTimeAfterTomorrow
    );
    console.log(tomorrowDayWeatherArray);
    let tomorrowArr = [];
    tomorrowDayWeatherArray.forEach((element) => {
      let result = element.main.temp;
      tomorrowArr.push(result);

      Math.max(element.main.temp);
    });
    console.log(tomorrowArr);
    let tomorrowArrNight = tomorrowArr.splice(0, 4);
    console.log(tomorrowArrNight);
    tomorrowArrDay = tomorrowArr;
    console.log(tomorrowArrDay);
    const nightTemp = Math.min.apply(null, tomorrowArrNight);
    const dayTemp = Math.max.apply(null, tomorrowArrDay);
    console.log(dayTemp, nightTemp);
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
