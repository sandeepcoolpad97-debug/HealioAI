import React, { useState } from 'react';
import { Paper, Box, Stack, MenuItem, Select, FormControl, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

const MainChart = () => {
  const [packageFilter, setPackageFilter] = useState('@mui/x-charts');
  const [typeFilter, setTypeFilter] = useState('Absolute');

  // Mock data for the chart
  const xLabels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  
  // Generating some dummy increasing data
  const uData = [20, 30, 40, 80, 90, 70, 80, 60, 50, 60, 50, 40, 60, 50, 40, 30, 50, 40, 50].map(x => x * 1000);
  const pData = [20, 35, 50, 95, 110, 100, 120, 140, 160, 180, 210, 230, 250, 260, 200, 310, 330, 290, 370].map(x => x * 1000);

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
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent="space-between">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Package' }}
          >
            <MenuItem value="@mui/x-charts">@mui/x-charts</MenuItem>
            <MenuItem value="@mui/material">@mui/material</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="Absolute">Absolute</MenuItem>
            <MenuItem value="Relative">Relative</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
        <LineChart
          height={400}
          series={[
            { data: uData, label: 'v6', area: true, showMark: false, color: '#4e79ff' },
            { data: pData, label: 'v7', area: true, showMark: false, color: '#f7c04a' },
            // v8 small sliver at the end
            { data: pData.map(v => v > 300000 ? v * 0.1 : 0), label: 'v8', area: true, showMark: false, color: '#ff6b6b' },
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          sx={{
            '.MuiLineElement-root': {
              strokeWidth: 2,
            },
            '.MuiAreaElement-series-v6': {
              fill: "url('#colorU')",
            },
          }}
          grid={{ vertical: true, horizontal: true }}
        />
      </Box>
    </Paper>
  );
};

export default MainChart;
