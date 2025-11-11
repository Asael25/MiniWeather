import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

// --- BARU: Kita butuh IconButton ---
import IconButton from '@mui/material/IconButton'; 
// --- DIHAPUS: Kita tidak butuh InputAdornment lagi ---
// import InputAdornment from '@mui/material/InputAdornment'; 

import { FiSearch } from 'react-icons/fi'; // Ikon ini akan kita pakai di tombol
import MyLocationIcon from '@mui/icons-material/MyLocation';

function Sidebar({ onSearch, onGetLocation }) {
  const [searchText, setSearchText] = useState("");

  // --- LOGIKA BARU (Lebih Rapi) ---
  // 1. Kita buat fungsi 'inti' untuk pencarian
  const triggerSearch = () => {
    if (!searchText) return; // Jangan cari jika teksnya kosong
    onSearch(searchText);
    setSearchText("");
  };

  // 2. Handler untuk tombol 'Enter'
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      triggerSearch(); // Panggil fungsi inti
    }
  };

  // 3. Handler untuk klik tombol cari
  const handleSearchClick = () => {
    triggerSearch(); // Panggil fungsi inti yang sama
  };
  // --- SELESAI LOGIKA BARU ---

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
        Papan Cuaca
      </Typography>
      
      {/* --- PERUBAHAN BESAR DI SINI --- */}
      {/* 1. Kita bungkus TextField dan Tombol Ikon dalam 'flex' Box */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
        
        {/* 2. TextField kita sekarang bersih tanpa ikon di dalamnya */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cari kota..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown} // Tetap dukung 'Enter'
        />

        {/* 3. Ini dia Tombol Cari kita! */}
        <IconButton 
          color="primary" // Beri warna (biru/sesuai tema)
          sx={{ ml: 1, p: '10px' }} // Beri sedikit jarak
          onClick={handleSearchClick} // Panggil handler klik
          aria-label="search" // Untuk aksesibilitas
        >
          <FiSearch />
        </IconButton>
      </Box>
      {/* --- SELESAI PERUBAHAN --- */}

      <Button
        variant="outlined"
        fullWidth
        startIcon={<MyLocationIcon />}
        sx={{ mt: 2, textTransform: 'none' }}
        onClick={onGetLocation}
      >
        Gunakan Lokasi Saat Ini
      </Button>
      
      {/* Daftar Kota Favorit (Placeholder) */}
      <Typography variant="h6" sx={{ mt: 4, color: 'text.secondary' }}>
        Kota Favorit
      </Typography>
      <List>
        <ListItem button>
          <ListItemText primary="Jakarta" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Bandung" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Surabaya" />
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;