import React from 'react';
import { Paper, Typography, Box, Stack } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const StatCard = ({ title, value, data, color }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 'auto' }}>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
        <Box sx={{ flexGrow: 1, height: 50 }}>
          <SparkLineChart
            data={data}
            height={50}
            colors={[color]}
            curve="natural"
            area
            showHighlight
            showTooltip
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default StatCard;
