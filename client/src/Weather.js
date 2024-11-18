import React, { useState, useEffect } from 'react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null); // Keep this as 'error' for the state

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, handleError); // Renamed the function
  }, []);

  const success = (position) => {
    const { latitude, longitude } = position.coords;
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=1ebf2ff3d9994f5497a151345242409&q=${latitude},${longitude}`
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data))
      .catch((err) => setError('Failed to load weather data'));
  };

  const handleError = () => { // Renamed the function
    setError('Unable to retrieve your location.');
  };

  return (
    <div className="container">
      {error ? (
        <div className="error">{error}</div>
      ) : weatherData ? (
        <div id="weather">
          <p>Location: {weatherData.location.name}, {weatherData.location.region}</p>
          <p>Temperature: {weatherData.current.temp_f}°F</p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <p>Wind: {weatherData.current.wind_kph} kph</p>
          <p>Humidity: {weatherData.current.humidity}%</p>
        </div>
      ) : (
        <div>Loading weather data...</div>
      )}
    </div>
  );
};

export default Weather;
