import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const ComplianceBadge = ({ icon, label }) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={{
        width: 'auto'
      }}
    >
      {/* Icon */}
      <Grid size="auto">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A5FB4',
            fontSize: { xs: '20px', md: '24px' }
          }}
        >
          {icon}
        </Box>
      </Grid>

      {/* Label */}
      <Grid size="auto">
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: { xs: '12px', md: '14px' },
            color: '#0A5FB4',
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ComplianceBadge;
