import { useState } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const NavbarDrawer = ({ navItems, activeSection, onNavClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavItemClick = (sectionId) => {
    onNavClick(sectionId);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: '#0A5FB4'
        }}
      >
        <Box sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '20px' }}>
          Menu
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleNavItemClick(item.id)}
                sx={{
                  px: 3,
                  py: 2,
                  backgroundColor: isActive ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                  borderLeft: isActive ? '4px solid #4CAF50' : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontFamily: 'Inter',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '16px',
                      color: isActive ? '#4CAF50' : '#0A5FB4'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default NavbarDrawer;
