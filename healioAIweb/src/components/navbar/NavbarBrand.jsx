import { Box, Typography, Avatar } from '@mui/material';
import navbarLogo from '../../assets/image.svg';

const NavbarBrand = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <Avatar
        src={navbarLogo}
        sx={{
          width: { xs: 32, md: 40 },
          height: { xs: 32, md: 40 },
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
        }}
        variant="rounded"
      />
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: { xs: '20px', md: '24px' },
          lineHeight: 1.333,
          letterSpacing: '-0.025em',
          color: '#FFFFFF'
        }}
      >
        Healio
      </Typography>
    </Box>
  );
};

export default NavbarBrand;
