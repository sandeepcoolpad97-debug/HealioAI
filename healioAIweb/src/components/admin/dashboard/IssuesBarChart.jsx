import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const IssuesBarChart = () => {
  const dataset = [
    { day: 'M', value: 45 },
    { day: 'T', value: 35 },
    { day: 'W', value: 30 },
    { day: 'T', value: 55 },
    { day: 'F', value: 45 },
    { day: 'S', value: 15 },
    { day: 'S', value: 10 },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Issues opened daily
      </Typography>
      
      <Box>
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'day', categoryGapRatio: 0.3 }]}
          series={[{ dataKey: 'value', color: '#4e79ff' }]}
          height={180}
          margin={{ top: 10, bottom: 0, left: -15, right: 10 }}
          slotProps={{
            legend: { hidden: true },
          }}
          borderRadius={4}
        />
      </Box>
    </Paper>
  );
};

export default IssuesBarChart;
