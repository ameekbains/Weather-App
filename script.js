function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city');
        return;
    }

    const weatherDiv = document.querySelector('.weather');
    weatherDiv.innerHTML = '<div class="loading">Fetching weather...</div>';

    fetch(`https://www.metaweather.com/api/location/search/?query=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                throw new Error('City not found');
            }
            const woeid = data[0].woeid;
            return fetch(`https://www.metaweather.com/api/location/${woeid}/`);
        })
        .then(response => response.json())
        .then(data => {
            const weather = data.consolidated_weather[0];
            weatherDiv.innerHTML = `
                <h2>${data.title}</h2>
                <p>Temperature: ${Math.round(weather.the_temp)}°C</p>
                <p>Weather: ${weather.weather_state_name}</p>
            `;
            getForecast(data.woeid);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherDiv.innerHTML = '<div class="error">Failed to fetch weather data</div>';
        });
}

function getForecast(woeid) {
    const weatherDiv = document.querySelector('.weather');
    weatherDiv.innerHTML += '<h3>Forecast:</h3>';

    fetch(`https://www.metaweather.com/api/location/${woeid}/`)
        .then(response => response.json())
        .then(data => {
            for (let i = 1; i < data.consolidated_weather.length; i++) {
                const forecast = data.consolidated_weather[i];
                weatherDiv.innerHTML += `
                    <p>${forecast.applicable_date}: ${Math.round(forecast.the_temp)}°C - ${forecast.weather_state_name}</p>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            weatherDiv.innerHTML += '<div class="error">Failed to fetch forecast data</div>';
        });
}
