import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'fc1c44c98eefd8b7dbc33fc0fa86cca5';
  const API_URL = 'https://api.openweathermap.org/data/2.5';

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError('Não foi possível obter sua localização');
        }
      );
    } else {
      setError('Geolocalização não é suportada pelo seu navegador');
    }
  };

  const getWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao buscar dados do clima');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('Cidade não encontrada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Previsão do Tempo</h1>
        
        <form onSubmit={getWeatherByCity}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Digite o nome da cidade"
          />
          <button type="submit">Buscar</button>
        </form>

        <button onClick={getCurrentLocation} className="location-btn">
          Usar Localização Atual
        </button>

        {loading && <p>Carregando...</p>}
        {error && <p className="error">{error}</p>}
        
        {weather && (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <div className="weather-details">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p className="temperature">{Math.round(weather.main.temp)}°C</p>
              <p className="description">{weather.weather[0].description}</p>
              <p>Sensação térmica: {Math.round(weather.main.feels_like)}°C</p>
              <p>Umidade: {weather.main.humidity}%</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
