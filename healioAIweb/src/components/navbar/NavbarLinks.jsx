import { Box } from '@mui/material';
import NavbarLink from './NavbarLink';

const NavbarLinks = ({ navItems, activeSection, onNavClick }) => {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: '32px'
      }}
    >
      {navItems.map((item) => (
        <NavbarLink
          key={item.id}
          item={item}
          isActive={activeSection === item.id}
          onClick={() => onNavClick(item.id)}
        />
      ))}
    </Box>
  );
};

export default NavbarLinks;
