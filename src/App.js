import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./mlh-prep.png";

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Get the user's geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  }, []);

  const fetchWeatherByCoordinates = (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_APIKEY}`;
    fetchWeatherData(url);
  };

  const fetchWeatherByCity = () => {
    if (city.trim() !== "") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_APIKEY}`;
      fetchWeatherData(url);
    } else {
      setError("Please enter a valid city name.");
    }
  };

  const fetchWeatherData = (url) => {
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.cod !== 200) {
            setIsLoaded(false);
            setError("City not found");
          } else {
            setIsLoaded(true);
            setResults(result);
            setCity(result.name + ", " + result.sys.country);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError("Error fetching weather data.");
        }
      );
  };

  return (
    <>
      <img className="logo" src={logo} alt="MLH Prep Logo" />
      <div>
        <h2>Enter a city below 👇</h2>
        <input
          type="text"
          placeholder="Search..."
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <button
          className="search"
          onClick={fetchWeatherByCity}
          disabled={!city.trim()} // Disable the button when there is no input
        >
          Search
        </button>
        <div className="Results">
          {!isLoaded && <h2>Loading...</h2>}
          {isLoaded && results && (
            <>
              <h3>{results.weather[0].main}</h3>
              <p>Feels like {results.main.feels_like}°C</p>
              <i>
                <p>
                  {results.name}, {results.sys.country}
                </p>
              </i>
            </>
          )}
          {error && <div>Error: {error}</div>}
        </div>
      </div>
    </>
  );
}

export default App;
