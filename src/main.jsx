import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // File ini sekarang kosong, tidak apa-apa

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// --- MULAI PERUBAHAN MUI ---
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 1. Ini adalah "CSS Reset" dari MUI, pengganti 'tailwind base'
// 2. Kita buat tema gelap
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
// --- SELESAI PERUBAHAN MUI ---

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* ThemeProvider akan memberi tema (gelap) ke semua komponen.
        CssBaseline akan memperbaiki semua style default browser.
      */}
      <ThemeProvider theme={darkTheme}>
        <CssBaseline /> 
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)