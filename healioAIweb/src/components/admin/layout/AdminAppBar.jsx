import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { AppBar } from './adminLayout.styles';
import AdminProfile from './AdminProfile';

export default function AdminAppBar({ open, onDrawerOpen }) {
  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerOpen}
          edge="start"
          sx={[
            { marginRight: 2 },
            open && { display: 'none' },
          ]}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Healio.AI Admin Console        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AdminProfile />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
