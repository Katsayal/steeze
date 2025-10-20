const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
  try {
    const response = await axios.get(url);
    const temp = response.data.main.temp;
    const condition = response.data.weather[0].main.toLowerCase(); // e.g., 'rain', 'clear'

    return {
      temperature: temp,
      condition,
      description: response.data.weather[0].description,
    };
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    return null;
  }
}

module.exports = { getWeatherByCoords };