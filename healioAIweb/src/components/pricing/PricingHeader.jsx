import { Box, Typography } from '@mui/material';

const PricingHeader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 4 },
        background: '#FFFFFF',
        borderRadius: { xs: '24px', md: '32px' },
        mx: { xs: 2, md: 4 },
        mb: 6,
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 700,
          color: '#1976D2',
          textAlign: 'center',
          mb: 2,
          lineHeight: 1.2,
        }}
      >
        Simple, Transparent Healthcare Pricing
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1rem', sm: '1.125rem' },
          color: '#616161',
          textAlign: 'center',
          maxWidth: '600px',
          lineHeight: 1.6,
        }}
      >
        Choose the plan that fits your health needs — upgrade anytime.
      </Typography>
    </Box>
  );
};

export default PricingHeader;
