import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import AdminProfile from './AdminProfile';

export default function AdminAppBar() {
  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Admin Console
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AdminProfile />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
