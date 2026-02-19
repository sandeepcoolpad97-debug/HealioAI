import React from 'react';
import { Box, Grid } from '@mui/material';
import StatCard from './StatCard';
import MainChart from './MainChart';
import DownloadsChart from './DownloadsChart';
import IssuesBarChart from './IssuesBarChart';
import IssuesHeatmap from './IssuesHeatmap';

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>

        {/* Left Column */}
        <Grid size={9}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <StatCard
                title="Users"
                value="144k"
                data={[10, 15, 12, 20, 18, 25, 22, 30]}
                color="#4e79ff"
              />
            </Grid>
            <Grid size={4}>
              <StatCard
                title="Conversions"
                value="325k"
                data={[30, 28, 25, 20, 15, 18, 15, 10]}
                color="#4e79ff"
              />
            </Grid>
            <Grid size={4}>
              <StatCard
                title="Event count"
                value="200k"
                data={[10, 12, 15, 15, 18, 18, 20, 22]}
                color="#4e79ff"
              />
            </Grid>
            <Grid size={12}>
              <MainChart />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid size={3}>
          <Grid container spacing={3} direction="column">
            <Grid size={12}>
              <DownloadsChart />
            </Grid>
            <Grid size={12}>
              <IssuesBarChart />
            </Grid>
            <Grid size={12}>
              <IssuesHeatmap />
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;
