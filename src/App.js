import { useEffect, useState } from "react";
import './App.css';
import logo from './mlh-prep.png';

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
          console.log([position.coords]);
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
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        if (result.cod !== 200) {
          setIsLoaded(false);
        } else {
          setIsLoaded(true);
          setResults(result);
          setCity(result.name + ", " + result.sys.country);
        }
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
      );
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <img className="logo" src={logo} alt="MLH Prep Logo" />
        <div>
          <h2>Enter a city below 👇</h2>
          <input
            type="text"
            placeholder="Search..."
            value={city}
            onChange={event => setCity(event.target.value)}
          />
          <div className="Results">
            {!isLoaded && <h2>Loading...</h2>}
            {isLoaded && results && (
              <>
                <h3>{results.weather[0].main}</h3>
                <p>Feels like {results.main.feels_like}°C</p>
                <i><p>{results.name}, {results.sys.country}</p></i>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
