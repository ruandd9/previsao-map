import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Paper, Fade } from '@mui/material';
import L from 'leaflet';

// Corrigir o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Estilo escuro para o mapa
const DARK_MAP_STYLE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

// Componente para atualizar a visualização do mapa
function MapUpdater({ center, onMapClick }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);

  useEffect(() => {
    if (onMapClick) {
      map.on('click', onMapClick);
      return () => map.off('click', onMapClick);
    }
  }, [map, onMapClick]);

  return null;
}

const WeatherMap = ({ weather, onLocationSelect }) => {
  if (!weather) return null;

  const position = [weather.coord.lat, weather.coord.lon];

  // Criar um ícone personalizado com o ícone do clima
  const weatherIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" style="width: 40px; height: 40px;" />`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const handleMapClick = (e) => {
    if (onLocationSelect) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ 
        height: '400px', 
        width: '100%', 
        borderRadius: 4, 
        overflow: 'hidden', 
        mt: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
          borderRadius: 'inherit',
          background: '#121212',
        },
        '& .custom-icon': {
          background: 'none',
          border: 'none',
        },
        '& .leaflet-popup-content-wrapper': {
          background: 'rgba(18, 18, 18, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
        },
        '& .leaflet-popup-tip': {
          background: 'rgba(18, 18, 18, 0.95)',
        }
      }}>
        <MapContainer
          center={position}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <MapUpdater center={position} onMapClick={handleMapClick} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={DARK_MAP_STYLE}
          />
          <Marker position={position} icon={weatherIcon}>
            <Popup>
              <Paper elevation={0} sx={{ p: 1, background: 'transparent' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="white">
                  {weather.name}, {weather.sys.country}
                </Typography>
                <Typography variant="body2" color="white">
                  {Math.round(weather.main.temp)}°C
                </Typography>
                <Typography variant="caption" color="grey.400">
                  {weather.weather[0].description}
                </Typography>
              </Paper>
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Fade>
  );
};

export default WeatherMap;
