import { Box, Container, Grid, Divider } from '@mui/material';
import FooterBrand from './FooterBrand';
import FooterLinks from './FooterLinks';
import FooterContact from './FooterContact';
import FooterCopyright from './FooterCopyright';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Features', id: 'features' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const supportLinks = [
    { label: 'FAQ', id: 'faq' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Medical Disclaimer', href: '#' },
    { label: 'Data Policy', href: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0A5FB4',
        py: { xs: 4, sm: 5, md: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FooterBrand />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FooterLinks title="Quick Links" links={quickLinks} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FooterLinks title="Support & Legal" links={supportLinks} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FooterContact />
          </Grid>
        </Grid>
        <Divider
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            mb: 2,
          }}
        />
        <FooterCopyright />
      </Container>
    </Box>
  );
};

export default Footer;
