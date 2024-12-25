import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Fade,
  Collapse,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  MyLocation as MyLocationIcon,
  WaterDrop as WaterDropIcon,
  Air as AirIcon,
  DeviceThermostat as TempIcon,
  WbSunny as SunriseIcon,
  NightsStay as SunsetIcon,
  Map as MapIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import './App.css';
import WeatherMap from './components/WeatherMap';

// Mapeia condições climáticas para gradientes
const weatherGradients = {
  // Dia claro
  '01d': 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
  // Noite clara
  '01n': 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
  // Nuvens dispersas dia
  '02d': 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',
  // Nuvens dispersas noite
  '02n': 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  // Nublado
  '03d': 'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)',
  '03n': 'linear-gradient(135deg, #334d50 0%, #cbcaa5 100%)',
  // Nuvens quebradas
  '04d': 'linear-gradient(135deg, #859398 0%, #283048 100%)',
  '04n': 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  // Chuva
  '09d': 'linear-gradient(135deg, #4B79A1 0%, #283E51 100%)',
  '09n': 'linear-gradient(135deg, #1F1C2C 0%, #928DAB 100%)',
  // Chuva
  '10d': 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
  '10n': 'linear-gradient(135deg, #2C3E50 0%, #000046 100%)',
  // Tempestade
  '11d': 'linear-gradient(135deg, #780206 0%, #061161 100%)',
  '11n': 'linear-gradient(135deg, #16222A 0%, #3A6073 100%)',
  // Neve
  '13d': 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)',
  '13n': 'linear-gradient(135deg, #2C3E50 0%, #BDC3C7 100%)',
  // Neblina
  '50d': 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',
  '50n': 'linear-gradient(135deg, #334d50 0%, #cbcaa5 100%)',
};

const defaultGradient = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';

// Componente estilizado para o ícone de expansão
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#121212',
      paper: 'rgba(18, 18, 18, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#fff',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2196f3',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 18, 18, 0.9)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
            opacity: 1,
          },
        },
      },
    },
  },
});

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gradient, setGradient] = useState(defaultGradient);
  const [showMap, setShowMap] = useState(false);

  const API_KEY = '46b84ccd7c4bcc1c2e6b5c805e08281e';
  const API_URL = 'https://api.openweathermap.org/data/2.5';

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (weather?.weather?.[0]?.icon) {
      setGradient(weatherGradients[weather.weather[0].icon] || defaultGradient);
    }
  }, [weather]);

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

  const getWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      console.error('Erro detalhado:', err.response || err);
      setError('Erro ao buscar dados do clima. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByCity = async () => {
    if (!city.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      console.error('Erro detalhado:', err.response || err);
      setError('Cidade não encontrada');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleMapLocationSelect = async ({ lat, lng }) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      console.error('Erro detalhado:', err.response || err);
      setError('Erro ao buscar dados do clima. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: gradient,
          transition: 'background 1.5s ease-in-out',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Fade in={true} timeout={1000}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 4,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                align="center" 
                sx={{ mb: 4 }}
              >
                Previsão do Tempo
              </Typography>

              <Box 
                component="form" 
                onSubmit={(e) => {
                  e.preventDefault();
                  getWeatherByCity();
                }} 
                sx={{ display: 'flex', gap: 1, mb: 3 }}
              >
                <TextField
                  fullWidth
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Digite o nome da cidade..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ 
                    minWidth: 'auto',
                    height: '40px',
                    borderRadius: 2,
                    px: 2,
                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                  }}
                >
                  <SearchIcon />
                </Button>
                <Button
                  variant="contained"
                  onClick={getCurrentLocation}
                  startIcon={<MyLocationIcon />}
                  sx={{ 
                    height: '40px',
                    borderRadius: 2,
                    px: 3,
                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                  }}
                >
                  Localização
                </Button>
              </Box>

              {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              )}

              {weather && (
                <Fade in={true} timeout={1000}>
                  <Card 
                    sx={{ 
                      mt: 2,
                      borderRadius: 4,
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 3 }}>
                        <Typography 
                          variant="h5" 
                          component="h2" 
                          gutterBottom 
                          align="center"
                          sx={{ fontWeight: 'bold' }}
                        >
                          {weather.name}
                        </Typography>
                        <Typography 
                          variant="subtitle1" 
                          align="center" 
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          {weather.sys.country && (
                            <img 
                              src={`https://flagcdn.com/24x18/${weather.sys.country.toLowerCase()}.png`}
                              alt={weather.sys.country}
                              style={{ 
                                verticalAlign: 'middle',
                                marginRight: '8px',
                                width: '24px',
                                height: '18px',
                                borderRadius: '2px'
                              }}
                            />
                          )}
                          {weather.sys.country}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          align="center" 
                          color="textSecondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                          }}
                        >
                          <span>Lat: {weather.coord.lat.toFixed(2)}°</span>
                          <span>•</span>
                          <span>Long: {weather.coord.lon.toFixed(2)}°</span>
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                        <img
                          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                          alt={weather.weather[0].description}
                          style={{ width: '150px', height: '150px' }}
                        />
                      </Box>

                      <Typography 
                        variant="h2" 
                        align="center" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {Math.round(weather.main.temp)}°C
                      </Typography>

                      <Typography 
                        variant="h6" 
                        align="center" 
                        color="textSecondary" 
                        gutterBottom
                        sx={{ 
                          textTransform: 'capitalize',
                          mb: 4
                        }}
                      >
                        {weather.weather[0].description}
                      </Typography>

                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={4}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <TempIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Sensação
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {Math.round(weather.main.feels_like)}°C
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={4}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <WaterDropIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Umidade
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {weather.main.humidity}%
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={4}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <AirIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Vento
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {Math.round(weather.wind.speed * 3.6)} km/h
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <SunriseIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Nascer do Sol
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {formatTime(weather.sys.sunrise)}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <SunsetIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Pôr do Sol
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {formatTime(weather.sys.sunset)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 1 }}>
                        <Button
                          startIcon={<MapIcon />}
                          onClick={() => setShowMap(!showMap)}
                          sx={{ mr: 1 }}
                        >
                          {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                        </Button>
                        <ExpandMore
                          expand={showMap}
                          onClick={() => setShowMap(!showMap)}
                          aria-expanded={showMap}
                          aria-label="mostrar mapa"
                        >
                          <ExpandMoreIcon />
                        </ExpandMore>
                      </Box>

                      <Collapse in={showMap} timeout="auto" unmountOnExit>
                        <WeatherMap 
                          weather={weather} 
                          onLocationSelect={handleMapLocationSelect}
                        />
                      </Collapse>
                    </CardContent>
                  </Card>
                </Fade>
              )}
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
