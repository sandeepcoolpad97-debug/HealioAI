import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import NavbarBrand from './NavbarBrand';
import NavbarLinks from './NavbarLinks';
import NavbarDrawer from './NavbarDrawer';
import { useScrollSpy } from './useScrollSpy';

const Navbar = ({ sections = {} }) => {
  const activeSection = useScrollSpy(sections);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Features', id: 'features' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', id: 'about' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' }
  ];

  // Handle smooth scroll on menu click
  const handleNavClick = (sectionId) => {
    const section = sections[sectionId];
    if (section?.current) {
      section.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#0A5FB4',
        boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.1), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
        top: 0,
        zIndex: 1100,
        paddingLeft: { xs: '16px', md: '48px' },
        paddingRight: { xs: '16px', md: '435px' }
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: { xs: '56px', md: '64px' },
          gap: { xs: 2, md: '293.5px' },
          flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}
      >
        <NavbarBrand />
        <NavbarLinks
          navItems={navItems}
          activeSection={activeSection}
          onNavClick={handleNavClick}
        />
        <NavbarDrawer
          navItems={navItems}
          activeSection={activeSection}
          onNavClick={handleNavClick}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
