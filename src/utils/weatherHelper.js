// src/utils/weatherHelper.js

// 1. Import HANYA ikon statis dari 'react-icons'
import {
  WiDaySunny, WiNightClear, WiCloud, WiCloudy, WiFog,
  WiDayRain, WiNightRain, WiRain, WiRainMix, WiShowers,
  WiSnow, WiSleet, WiThunderstorm, WiDayHaze
} from 'react-icons/wi';

// 2. Kamus kita sekarang HANYA berisi deskripsi dan ikon (tanpa Lottie)
const weatherMap = {
  0: { description: 'Cerah', icon: WiDaySunny },
  1: { description: 'Umumnya Cerah', icon: WiDaySunny },
  2: { description: 'Sebagian Berawan', icon: WiCloud },
  3: { description: 'Berawan', icon: WiCloudy },
  45: { description: 'Kabut', icon: WiFog },
  48: { description: 'Kabut Membeku', icon: WiFog },
  51: { description: 'Gerimis Ringan', icon: WiRainMix },
  53: { description: 'Gerimis Sedang', icon: WiRainMix },
  55: { description: 'Gerimis Lebat', icon: WiRainMix },
  56: { description: 'Gerimis Beku Ringan', icon: WiRainMix },
  57: { description: 'Gerimis Beku Lebat', icon: WiRainMix },
  61: { description: 'Hujan Ringan', icon: WiRain },
  63: { description: 'Hujan Sedang', icon: WiRain },
  65: { description: 'Hujan Lebat', icon: WiRain },
  66: { description: 'Hujan Beku Ringan', icon: WiRain },
  67: { description: 'Hujan Beku Lebat', icon: WiRain },
  71: { description: 'Salju Ringan', icon: WiSnow },
  73: { description: 'Salju Sedang', icon: WiSnow },
  75: { description: 'Salju Lebat', icon: WiSnow },
  77: { description: 'Butiran Salju', icon: WiSnow },
  80: { description: 'Hujan Ringan', icon: WiShowers },
  81: { description: 'Hujan Sedang', icon: WiShowers },
  82: { description: 'Hujan Deras', icon: WiShowers },
  85: { description: 'Hujan Salju Ringan', icon: WiSnow },
  86: { description: 'Hujan Salju Lebat', icon: WiSnow },
  95: { description: 'Badai Petir', icon: WiThunderstorm },
  96: { description: 'Badai Petir (Hujan Es)', icon: WiThunderstorm },
  99: { description: 'Badai Petir (Hujan Es)', icon: WiThunderstorm },
};

// 3. Fungsi penerjemah kita
export const getWeatherInfo = (code) => {
  return weatherMap[code] || {
    description: 'Tidak Diketahui',
    icon: WiDayHaze, // Ikon default
  };
};