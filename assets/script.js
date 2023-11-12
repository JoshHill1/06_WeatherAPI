var citySearchEl = document.querySelector("#citySearch");
var cityHistory = document.querySelector("#cityList");
var weatherEl = document.querySelector("#weather");
var APIKey = "f5b3594cba6f43c7e9291e08d3435c13";
var cityList = [];
var currentDay = dayjs().format('(MM/DD/YYYY)');

// linking API
function weather(city) {
  var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
  
  // Getting Data
  fetch(cityURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    currentWeather(data);
  })
};


function forecast(city) {
  console.log(city);
  clearForecast();
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=imperial";
  
  fetch(forecastURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    weatherForecast(data);
  })
};

function clearForecast() {
  // Clears any existing forcast data
  document.querySelector("#forecast1").innerHTML = "";
  document.querySelector("#forecast2").innerHTML = "";
  document.querySelector("#forecast3").innerHTML = "";
  document.querySelector("#forecast4").innerHTML = "";
  document.querySelector("#forecast5").innerHTML = "";
};

// Load the city search history from localStorage on page load
window.addEventListener("load", function () {
  var storedCityList = JSON.parse(localStorage.getItem("city"));
  if (Array.isArray(storedCityList)) {
    cityList = storedCityList;
    updateCitySearchHistory();
  }
});

function citySearch(event) {
  event.preventDefault();
  let city = citySearchEl.value.trim();

  // Check if the city is not empty
  if (city !== "") {
    cityList.push(city);
    localStorage.setItem("city", JSON.stringify(cityList));
    updateCitySearchHistory();
  }

  // Clears search box after "Search" button is clicked
  document.getElementById("citySearch").value = "";
}

function updateCitySearchHistory() {
  // Makes sure that city history doesn't duplicate
  cityHistory.innerHTML = "";

  cityList.forEach(function (city) {
    var listItem = document.createElement("li");

    // Create a button for each city and set its text content to the city name
    var cityButton = document.createElement("button");
    cityButton.textContent = city;
    cityButton.classList.add("cityList");
    listItem.appendChild(cityButton);

    // Add click event listener to the city button
    cityButton.addEventListener("click", function () {
      // On button click, fetch weather and forecast data for the selected city
      let city = cityButton.textContent;
      weather(city);
      forecast(city);
    });
    cityHistory.appendChild(listItem);
  })
};

function currentWeather(data) {
    var weather = document.querySelector("#weather");
    // Clear the existing weather information before displaying new data
    var weatherContainer = document.querySelector(".container-weather");
    // Needs to display none(in stylesheet) and display flex(here)
    weatherContainer.setAttribute("style", "display: flex;");

    weather.innerHTML = "";

    var cityNameEl = document.createElement("h1");
    cityNameEl.textContent = data.name;

    var currentDayEl = document.createElement("h2");
    currentDayEl.textContent = currentDay;

    var weatherIconEl = document.createElement("img");
    var weatherIconCode = data.weather[0].icon;
    weatherIconEl.setAttribute("src", "https://openweathermap.org/img/w/" + weatherIconCode + ".png");
    weatherIconEl.setAttribute("alt", "Weather Icon");

    var temperatureEl = document.createElement("p");
    temperatureEl.textContent = "Temp: " + data.main.temp + " °F";

    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind: " + data.wind.speed + " MPH";
    
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.main.humidity + "%";

    // Append all elements to the weather div
    weather.appendChild(cityNameEl);
    weather.appendChild(currentDayEl);
    weather.appendChild(weatherIconEl);
    weather.appendChild(temperatureEl);
    weather.appendChild(windSpeedEl);
    weather.appendChild(humidityEl);
}

function weatherForecast(data) {
    console.log(data);
    var forecastContainer = document.querySelector(".container-forecast");
    forecastContainer.setAttribute("style", "display: flex;");

    //created forecast cards to improve display in container
    //start with 1 to get next day instead of current day
    for (var i = 1; i <= 5; i++) {
        if (i === 1) {
            var forecast = document.querySelector("#forecast1");
        }
        else if (i === 2) {
            var forecast = document.querySelector("#forecast2");
        }
        else if (i === 3) {
            var forecast = document.querySelector("#forecast3");
        }
        else if (i === 4) {
            var forecast = document.querySelector("#forecast4");
        }
        else if (i === 5) {
            var forecast = document.querySelector("#forecast5");
        }

        var forecastData = data.list[i * 8 - 1];// adjust index to get next day instead of current
        //create elements to add weeather info to html by creating elements
        var cityNameEl = document.createElement("h2");
        cityNameEl.textContent = data.name;

        var forecastDate = dayjs().add(i, 'day').format('MMMM D'); // Calculate the forecast date for each day
        var currentDayEl = document.createElement("h2");
        currentDayEl.textContent = forecastDate;

        var weatherIconEl = document.createElement("img");
        var forecastIcon = forecastData.weather[0].icon;
        weatherIconEl.setAttribute("src", "https://openweathermap.org/img/w/" + forecastIcon + ".png");
        weatherIconEl.setAttribute("alt", "Weather Icon");

        var temperatureEl = document.createElement("p");
        temperatureEl.textContent = "Temp: " + forecastData.main.temp + " °F";

        var windSpeedEl = document.createElement("p");
        windSpeedEl.textContent = "Wind: " + forecastData.wind.speed + " MPH";
        
        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + forecastData.main.humidity + "%";

        // Append all elements to the forecast div
        forecast.appendChild(cityNameEl);
        forecast.appendChild(currentDayEl);
        forecast.appendChild(weatherIconEl);
        forecast.appendChild(temperatureEl);
        forecast.appendChild(windSpeedEl);
        forecast.appendChild(humidityEl);
    }
}
searchForm.addEventListener("submit", citySearch);
//cityButton.addEventListener("click", cityList);
