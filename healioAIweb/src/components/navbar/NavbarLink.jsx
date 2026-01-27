import { Button } from '@mui/material';

const NavbarLink = ({ item, isActive, onClick }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        color: isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'Inter',
        fontWeight: isActive ? 600 : 500,
        fontSize: { xs: '14px', md: '16px' },
        lineHeight: 1.5,
        textTransform: 'none',
        padding: { xs: '4px 0', md: '6px 0' },
        position: 'relative',
        transition: 'color 0.3s ease, font-weight 0.3s ease',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: isActive ? '#4CAF50' : 'transparent',
          transition: 'background-color 0.3s ease'
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: isActive ? '#4CAF50' : '#FFFFFF'
        }
      }}
    >
      {item.label}
    </Button>
  );
};

export default NavbarLink;
