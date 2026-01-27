import React from 'react';
import { Box, Typography } from '@mui/material';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        p: { xs: 3, md: 4 },
        boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <Box
          sx={{
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            borderRadius: '50%',
            backgroundColor: '#ECFDF3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: { xs: '18px', md: '20px' },
          color: '#0A5FB4',
          mb: 1.5,
          lineHeight: 1.3
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: { xs: '14px', md: '15px' },
          color: '#6B7280',
          lineHeight: 1.6,
          flex: 1
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default FeatureCard;
