import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const FeaturesHeader = () => {
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

      {/* Main Title */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: { xs: '28px', md: '36px', lg: '40px' },
          color: '#0A5FB4',
          mb: 2,
          lineHeight: 1.2
        }}
      >
        Powerful features Designed for Smarter Healthcare
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: { xs: '16px', md: '18px' },
          color: '#6B7280',
          mx: 'auto',
          lineHeight: 1.6
        }}
      >
        AI-driven tools that simplify care, improve decisions, and protect your health data.
      </Typography>
    </Box>
  );
};

export default FeaturesHeader;
