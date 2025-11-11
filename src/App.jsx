import { useQuery } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';

// --- BARU: Import useState ---
import React, { useState } from 'react'; 
// -----------------------------

// --- BARU: Fungsi untuk membuat URL API dinamis ---
// Kita pisahkan ini agar bisa dipakai ulang
const createWeatherApiUrl = (lat, long) => {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
};

// --- BARU: URL API Geocoding ---
// Ini akan mengubah "nama kota" jadi "koordinat"
const createGeocodingApiUrl = (city) => {
  return `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
};
// ---------------------------------
// ... createGeocodingApiUrl ...

// --- BARU: URL API Reverse Geocoding ---
// Ini akan mengubah "koordinat" jadi "nama kota"
const createReverseGeocodingApiUrl = (lat, long) => {
  return `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=id`;
};
// ---------------------------------
// Fungsi fetchWeather kita sekarang dinamis, butuh 'location'
// Perhatikan { queryKey }
async function fetchWeather({ queryKey }) {
  // queryKey[0] adalah 'weather'
  // queryKey[1] adalah objek 'location' kita
  const [_key, location] = queryKey;
  
  if (!location) return null; // Jangan fetch jika tidak ada lokasi

  const API_URL = createWeatherApiUrl(location.latitude, location.longitude);
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

function App() {
  // --- BARU: 'Memori' (State) untuk lokasi kita ---
  // Default-nya adalah Jakarta
  const [location, setLocation] = useState({
    name: 'Jakarta',
    latitude: -6.175,
    longitude: 106.826,
  });
  // ----------------------------------------------

  const { data, isLoading, isError } = useQuery({
    // --- BARU: queryKey sekarang 'dinamis' ---
    // Jika 'location' berubah, useQuery akan otomatis refetch!
    queryKey: ['weather', location], 
    // --------------------------------------
    queryFn: fetchWeather,
    enabled: !!location, // Hanya jalankan jika 'location' ada isinya
  });

  // --- BARU: Fungsi yang akan menangani pencarian ---
  const handleSearch = async (city) => {
    if (!city) return;
    
    try {
      // 1. Panggil API Geocoding
      const geoResponse = await fetch(createGeocodingApiUrl(city));
      const geoData = await geoResponse.json();
      
      // 2. Cek jika hasilnya ada
      if (geoData.results && geoData.results.length > 0) {
        const firstResult = geoData.results[0];
        // 3. Update 'memori' (state) lokasi kita
        // Ini akan OTOMATIS memicu 'useQuery' untuk mengambil data cuaca baru
        setLocation({
          name: firstResult.name,
          latitude: firstResult.latitude,
          longitude: firstResult.longitude,
        });
      } else {
        alert("Kota tidak ditemukan!");
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      alert("Gagal mencari kota.");
    }
  };
  // ----------------------------------------------------
// ... di dalam function App() ...

// ... fungsi handleSearch ...

// --- BARU: Fungsi untuk menangani 'Gunakan Lokasi Saya' ---
const handleGetLocation = () => {
  if (!navigator.geolocation) {
    alert("Browser Anda tidak mendukung Geolocation.");
    return;
  }

  // 1. Minta lokasi ke browser
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      // 2. Jika berhasil, dapatkan koordinat
      const { latitude, longitude } = position.coords;

      try {
        // 3. Panggil API Reverse Geocoding untuk dapat NAMA KOTA
        const response = await fetch(createReverseGeocodingApiUrl(latitude, longitude));
        const data = await response.json();

        // 4. Update state 'location'
        // Ini akan otomatis memicu 'useQuery' untuk data cuaca
        setLocation({
          name: data.city || data.locality || 'Lokasi Saat Ini', // Ambil nama kota
          latitude: latitude,
          longitude: longitude,
        });
      } catch (error) {
        console.error("Error fetching reverse geocoding data:", error);
        // Jika gagal dapat nama, setidaknya tampilkan cuacanya
        setLocation({
          name: 'Lokasi Saat Ini',
          latitude: latitude,
          longitude: longitude,
        });
      }
    },
    (error) => {
      // 5. Jika pengguna menolak atau gagal
      console.error("Error getting location:", error);
      alert("Gagal mengakses lokasi. Pastikan Anda mengizinkan akses lokasi.");
    }
  );
};
// ----------------------------------------------------

// ... sisa kode (state loading, error, return) ...
  // State Loading (Sama)
  if (isLoading || !data) { // Ditambah pengecekan !data
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {/* BARU: Pesan loading dinamis */}
          Mengambil data untuk {location.name}...
        </Typography>
      </Box>
    );
  }

  // State Error (Sama)
  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">Gagal mengambil data! 😭</Typography>
      </Box>
    );
  }

  // JIKA BERHASIL:
  return (
   
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      flexDirection: { xs: 'column', md: 'row' } 
    }}>
      <Box sx={{ 
        width: { xs: '100%', md: '25%' }, 
        height: { xs: 'auto', md: '100%' }, 
        bgcolor: 'background.paper',
        borderBottom: { xs: '1px solid grey', md: 'none' } 
      }}>
        <Sidebar onSearch={handleSearch} onGetLocation={handleGetLocation} />
      </Box>

      <Box sx={{ 
        width: { xs: '100%', md: '75%' }, 
        height: { xs: 'auto', md: '100%' }, 
        overflowY: 'auto', 
        p: { xs: 2, md: 4 } 
      }}>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={location.name} // key-nya biarkan
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MainDashboard weatherData={data} cityName={location.name} />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default App;