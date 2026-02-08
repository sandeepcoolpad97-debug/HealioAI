import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';
import AdminAppBar from './AdminAppBar';
import AdminDrawer from './AdminDrawer';

export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* Sidebar - 20% width */}
      <Box sx={{ 
        width: '15%', 
        flexShrink: 0,
        borderRight: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflowY: 'auto'
      }}>
        <AdminDrawer />
      </Box>

      {/* Main Content - 80% width */}
      <Box sx={{ 
        width: '85%', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%' 
      }}>
        <AdminAppBar />
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 3, 
          overflowY: 'auto',
          bgcolor: '#f5f5f5' // Optional: light grey background for content area
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
