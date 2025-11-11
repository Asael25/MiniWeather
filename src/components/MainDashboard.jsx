import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip
} from 'recharts';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Import helper "kamus" kita
import { getWeatherInfo } from '../utils/weatherHelper';

// Fungsi helper (formatTime, formatDay) TIDAK BERUBAH
const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  });
};
const formatDay = (isoString) => {
  return new Date(isoString).toLocaleString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short'
  });
};

function MainDashboard({ weatherData, cityName }) {
  const { current_weather, hourly, daily } = weatherData;

  const chartData = hourly.time.slice(0, 24).map((time, index) => ({
    time: formatTime(time),
    temp: hourly.temperature_2m[index],
  }));

  // Panggil "Kamus" untuk cuaca saat ini
  const currentInfo = getWeatherInfo(current_weather.weathercode);

  // Siapkan komponen ikonnya
  const CurrentIconComponent = currentInfo.icon;

  return (
    <Box>
      {/* BAGIAN ATAS: Cuaca Saat Ini */}
      
      {/* -- PERUBAHAN RESPONSIVE 1: Ukuran Font -- */}
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '2.5rem', md: '3rem' } // Lebih kecil di HP
        }}
      >
        {cityName}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, ml: -2 }}>
        
        {/* -- PERUBAHAN RESPONSIVE 2: Ukuran Font -- */}
        <Typography
          variant="h2"
          component="p"
          sx={{
            fontWeight: 200,
            m: 0,
            fontSize: { xs: '3.5rem', md: '5.5rem' } // Jauh lebih kecil di HP
          }}
        >
          {Math.round(current_weather.temperature)}°C
        </Typography>

        {/* Ikon Statis yang SANGAT BESAR */}
        <Box sx={{
          width: 120,
          height: 120,
          ml: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ fontSize: '6rem', color: '#8884d8' }}>
            <CurrentIconComponent />
          </Typography>
        </Box>
      </Box>

      {/* Deskripsi cuaca */}
      <Typography variant="h6" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
        {currentInfo.description}
      </Typography>


      {/* BAGIAN TENGAH: Grafik Per Jam */}
      <Typography variant="h5" component="h3" sx={{ mt: 6, mb: 2 }}>
        Prakiraan Per Jam
      </Typography>
      
      {/* -- PERUBAHAN RESPONSIVE 3: Ukuran Grafik & Padding -- */}
      <Paper sx={{
        height: { xs: '150px', md: '200px' }, // Lebih pendek di HP
        p: { xs: 1, md: 3 }, // Padding lebih kecil di HP
        bgcolor: 'background.paper'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" stroke="grey" fontSize={12} />
            <YAxis stroke="grey" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', border: 'none' }}
              labelStyle={{ color: 'white' }}
            />
            <Line type="monotone" dataKey="temp" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>


      {/* BAGIAN BAWAH: Prakiraan 5 Hari */}
      <Typography variant="h5" component="h3" sx={{ mt: 6, mb: 2 }}>
        Prakiraan 5 Hari
      </Typography>
      <Grid container spacing={2}>
        {daily.time.slice(0, 5).map((time, index) => {

          const dayInfo = getWeatherInfo(daily.weathercode[index]);
          const IconComponent = dayInfo.icon;

          return (
            <Grid item key={time} xs={12} sm={6} md={2.4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatDay(time)}
                </Typography>

                <Typography variant="h4" sx={{ my: 1, fontSize: '3.5rem', color: '#8884d8' }}>
                  <IconComponent />
                </Typography>

                <Typography variant="h6">
                  {Math.round(daily.temperature_2m_max[index])}°
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {Math.round(daily.temperature_2m_min[index])}°
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', textTransform: 'capitalize', mt: 1, display: 'block' }}
                >
                  {dayInfo.description}
                </Typography>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  );
}

export default MainDashboard;