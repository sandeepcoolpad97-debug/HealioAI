import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const DownloadsChart = () => {
  const data = [
    { id: 0, value: 60, label: 'v5', color: '#4e79ff' },
    { id: 1, value: 30, label: 'v6', color: '#f7c04a' },
    { id: 2, value: 10, label: 'v7', color: '#ff6b6b' },
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
        @mui/material downloads on Jun 29, 25
      </Typography>
      
      <Box>
        <PieChart
          series={[
            {
              data,
              innerRadius: 60,
              outerRadius: 80,
              paddingAngle: 2,
              cornerRadius: 5,
              startAngle: -90,
              endAngle: 90,
              cx: 140,
              cy: 130,
            },
          ]}
          height={100}
          width={280}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
            },
          }}
          margin={{ top: -50, bottom: 40, left: 0, right: 0 }}
        />
      </Box>
    </Paper>
  );
};

export default DownloadsChart;
